"use client";

// 必要なライブラリやコンポーネントをインポート
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { setReview, updateReview } from "@/actions/review.action";
import { paperData, reviewType } from "@/constants";
import React, {
  ChangeEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { Loader2 } from "lucide-react";
import CancelCreateReview from "./CancelCreateReview";
import {
  fetchPaperByDOI,
  paperDetailsType,
  paperErrorType,
} from "@/actions/paper.action";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";
import { Modal } from "../review/Modal";
import { SiDoi } from "react-icons/si";
import { IoIosPaper } from "react-icons/io";
import { delEmpty_tag } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactMarkDown from "react-markdown";
import { uploadImage } from "@/actions/image.action";
import Image from "next/image";
import { useToast } from "../ui/use-toast";
import { Toaster } from "../ui/toaster";
import { usePathname } from "next/navigation";

// フォームのバリデーションスキーマを定義
const FormSchema = z.object({
  // 各フィールドにバリデーションルールを設定
  title: z.string().min(1, {
    message: "Title Required", // Titleは必須
  }),
  ReviewContents: z.string().min(2, {
    message: "ReviewContents must be at least 2 characters.", // レビュー内容は最低2文字必要
  }),
  // Tagsフィールドのバリデーションルール（特に制限なし）
  Tags: z.string(),
  photoUrl: z.string(),
});

// ReviewFormコンポーネントを定義
export function ReviewForm({
  userId,
  userName,
  review,
}: {
  userId: string;
  userName: string;
  review: reviewType;
}) {
  const authors: Array<{ name: string }> = [{ name: review.authors }];

  const isLoading = useRef(false); // ローディング状態を追跡するためのuseRef
  const [isPreview, setPreview] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const pathname = usePathname();

  const bePreview = () => {
    setPreview(true);
  };

  const beEdit = () => {
    setPreview(false);
  };

  const [paper, setPaper] = useState<paperDetailsType & paperErrorType>({
    title: review.paperTitle,
    year: review.year,
    externalIds: {
      DOI: review.doi,
    },
    url: review.link,
    journal: {
      name: review.journal_name,
      pages: review.journal_pages,
      volume: review.journal_vol,
    },
    authors: authors,
    venue: review.venue,
    error: "",
  });

  // useFormフックを使ってフォームを初期化
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema), // zodResolverを使ってバリデーションを設定
    defaultValues: {
      // フォームフィールドのデフォルト値を設定
      ReviewContents: review.contents ? review.contents : "",
      title: review.paperTitle ? review.paperTitle : "",
      Tags: review.tags ? review.tags.toString() : "",
      photoUrl: review.imageUrl ? review.imageUrl : "",
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  // フォーム送信時の処理を定義
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!paper || (paper && paper.error)) {
      alert("DOIが見つかりません\n手動入力に切り替えてください");
      return;
    }

    isLoading.current = true;

    const id = review.id ? review.id : Date.now().toString(); // レビューIDを現在のタイムスタンプで生成

    const url = files[0] ? await uploadImage(files[0], id) : review.imageUrl;

    // 提出用のレビューデータを準備
    const reviewData: reviewType = {
      id: id,
      contents: data.ReviewContents,
      paperTitle: paper.title,
      venue: paper.venue,
      year: paper.year,
      journal_name: paper.journal.name,
      journal_pages: paper.journal.pages,
      journal_vol: paper.journal.volume,
      authors: paper.authors[0].name,
      doi: paper.externalIds.DOI,
      link: paper.url,
      reviewerName: userName,
      createdBy: userId,
      tags: delEmpty_tag(data.Tags),
      imageUrl: url,
    };

    try {
      // レビューデータの送信を試みる
      if (pathname === "/create") {
        await setReview(userId, reviewData);
      } else {
        await updateReview(userId, reviewData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onChageHandler = useDebouncedCallback(async (e) => {
    toast({ title: "論文情報を検索中" });
    const paperData = await fetchPaperByDOI(e.target.value);
    if (paperData.title) {
      toast({ title: "論文情報を取得しました" });
    } else {
      toast({
        title: "論文情報取得に失敗しました",
        description: "DOIを再入力するか、手動で論文情報を入力してください。",
        variant: "destructive",
      });
    }
    form.setValue("title", paperData.title);
    setPaper(paperData);
  }, 1000);

  const onChangeTagsHandler = async (e: { target: { value: string } }) => {
    form.setValue("Tags", e.target.value);
  };

  // フォームのレンダリングを行う
  return (
    <Form {...form}>
      <Toaster />

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <Button
          type="button"
          onClick={beEdit}
          className={`
            ${
              !isPreview
                ? "bg-white border border-gray-300 hover:bg-white  text-gray-800"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:border-gray-400 focus:ring focus:ring-gray-200"
            }
            px-4 py-2 rounded-none rounded-l-md text-xs w-fit
        `}
        >
          Edit
        </Button>
        <Button
          type="button"
          onClick={bePreview}
          className={`
            ${
              isPreview
                ? "bg-white border border-gray-300 hover:bg-white text-gray-800"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:border-gray-400 focus:ring focus:ring-gray-200"
            }
            px-4 py-2 rounded-none rounded-r-md text-xs w-fit
        `}
        >
          Preview
        </Button>
        {!isPreview ? (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-row gap-1">
                    タイトル<p className="text-red-600">*</p>
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {form.getValues("title")
                              ? form.getValues("title")
                              : "Search paper by DOI..."}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[50vw] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search paper by DOI..."
                            onChangeCapture={onChageHandler}
                          />
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ReviewContents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-row gap-1">
                    レビュー<p className="text-red-600">*</p>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="論文のレビューを入力してください。"
                      id="message"
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タグ(半角カンマ区切りで入力)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="タグを入力してください。"
                      {...field}
                      onChange={onChangeTagsHandler}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4 w-1/2">
                  <FormControl className="flex-1 text-base-semibold text-gray-200">
                    <Input
                      type="file"
                      accept="image/*"
                      placeholder="Add profile photo"
                      className="account-form_image-input hidden"
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </FormControl>
                  <FormLabel>画像</FormLabel>
                  <FormLabel className="account-form_image-label">
                    {field.value ? (
                      <Image
                        src={field.value}
                        alt="reviewImage"
                        width={1920}
                        height={1080}
                        priority
                        className="object-contain max-h-[30vh]"
                      />
                    ) : (
                      <div className="flex justify-center items-center h-[30vh] border-dashed border-2 text-gray-600">
                        左クリックで画像を選択
                      </div>
                    )}
                  </FormLabel>
                </FormItem>
              )}
            />
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="truncate leading-normal text-blue-600 hover:text-blue-400 hover:underline">
                {form.getValues("title")}
              </CardTitle>
              <CardDescription>{paper.authors[0].name}</CardDescription>
              <CardDescription>
                {paper.journal.name ? paper.journal.name + "." : ""}
                {paper.year ? paper.year + "." : ""}
                {paper.journal.volume ? paper.journal.volume + "." : ""}
                {paper.journal.pages ? paper.journal.pages + "." : ""}
              </CardDescription>
              {(paper.externalIds.DOI || paper.url) && (
                <div className="flex flex-row gap-2 py-3">
                  {paper.externalIds.DOI && <SiDoi size="2rem" />}
                  {paper.url && <IoIosPaper size="2rem" />}
                </div>
              )}
              <Separator />
            </CardHeader>
            {form.getValues("Tags") && form.getValues("Tags").length !== 0 && (
              <CardContent className="flex gap-2">
                {form.getValues("Tags")
                  ? form
                      .getValues("Tags")
                      .split(",")
                      .map((tag) => {
                        return (
                          <p
                            key={tag}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            #{tag}
                          </p>
                        );
                      })
                  : ""}
              </CardContent>
            )}
            <CardContent>
              <p className="flex text-blue-400 hover:text-blue-600 underline gap-2">
                <Image
                  src="/icon.png"
                  alt="Icon Image"
                  className="rounded"
                  width={24}
                  height={24}
                />
                {userName}
              </p>
            </CardContent>
            {form.getValues("photoUrl") && (
              <CardContent>
                <Modal imageUrl={form.getValues("photoUrl")} />
              </CardContent>
            )}
            <CardContent className="markdown">
              <ReactMarkDown className="line-clamp-4">
                {form.getValues("ReviewContents")}
              </ReactMarkDown>
            </CardContent>
          </Card>
        )}

        {isLoading.current ? (
          <Button disabled>
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        ) : (
          <div className="flex flex-row gap-3">
            <Button type="submit">Save</Button>
            <CancelCreateReview />
          </div>
        )}
      </form>
    </Form>
  );
}