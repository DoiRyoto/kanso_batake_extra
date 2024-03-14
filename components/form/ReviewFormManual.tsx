"use client";

// 必要なライブラリやコンポーネントをインポート
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { reviewType } from "@/constants";
import { ChangeEvent, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import CancelCreateReview from "./CancelCreateReview";

import { delEmpty_tag } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactMarkDown from "react-markdown";
import Image from "next/image";
import { uploadImage } from "@/actions/image.action";
import { usePathname } from "next/navigation";
import { SiDoi } from "react-icons/si";
import { IoIosPaper } from "react-icons/io";
import { Separator } from "../ui/separator";
import { Modal } from "../review/Modal";

// フォームのバリデーションスキーマを定義
const FormSchema = z.object({
  // 各フィールドにバリデーションルールを設定
  PaperTitle: z.string().min(2, {
    message: "PaperTitle must be at least 2 characters.", // 論文タイトルは最低2文字必要
  }),
  venue: z.string().min(0, {
    message: "venue must be at least 0 characters.", // 会場名は最低0文字（空でも可）
  }),
  year: z.string().min(2, {
    message: "year must be at least 2 characters.", // 発表年は最低2文字必要
  }),
  journal_name: z.string().min(0, {
    message: "journal name must be at least 0 characters.", // 雑誌名は最低0文字（空でも可）
  }),
  journal_pages: z.string().min(0, {
    message: "journal pages must be at least 0 characters.", // 雑誌のページ数は最低0文字（空でも可）
  }),
  journal_vol: z.string().min(0, {
    message: "journal volume must be at least 0 characters.", // 雑誌の巻数は最低0文字（空でも可）
  }),
  authors: z.string().min(1, {
    message: "authors must be at least 1 characters.", // 著者名は最低1文字必要
  }),
  doi: z.string().min(0, {
    message: "doi must be at least 0 characters.", // DOIは最低0文字（空でも可）
  }),
  link: z.string().min(0, {
    message: "link must be at least 0 characters.", // リンクは最低0文字（空でも可）
  }),
  ReviewContents: z.string().min(2, {
    message: "ReviewContents must be at least 2 characters.", // レビュー内容は最低2文字必要
  }),
  // Tagsフィールドのバリデーションルール（特に制限なし）
  Tags: z.string(),
  photoUrl: z.string(),
});

// ReviewFormコンポーネントを定義
export function ReviewFormManual({
  userId,
  userName,
  review,
}: {
  userId: string;
  userName: string;
  review: reviewType;
}) {
  const isLoading = useRef(false); // ローディング状態を追跡するためのuseRef
  const [isPreview, setPreview] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const pathname = usePathname();

  const bePreview = () => {
    setPreview(true);
  };
  const beEdit = () => {
    setPreview(false);
  };

  // useFormフックを使ってフォームを初期化
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema), // zodResolverを使ってバリデーションを設定
    defaultValues: {
      // フォームフィールドのデフォルト値を設定
      PaperTitle: review.paperTitle ? review.paperTitle : "",
      ReviewContents: review.contents ? review.contents : "",
      venue: review.venue ? review.venue : "",
      year: review.year ? review.year.toString() : "",
      journal_name: review.journal_name ? review.journal_name : "",
      journal_pages: review.journal_pages ? review.journal_pages : "",
      journal_vol: review.journal_vol ? review.journal_vol : "",
      authors: review.authors ? review.authors : "",
      doi: review.doi ? review.doi : "",
      link: review.link ? review.link : "",
      Tags: review.tags ? review.tags.toString() : "",
      photoUrl: review.imageUrl ? review.imageUrl : "",
    },
  });

  // フォーム送信時の処理を定義
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    isLoading.current = true;

    const id = review.id ? review.id : Date.now().toString(); // レビューIDを現在のタイムスタンプで生成

    const url = files[0] ? await uploadImage(files[0], id) : review.imageUrl;

    // 提出用のレビューデータを準備
    const reviewData: reviewType = {
      id: id,
      contents: data.ReviewContents,
      paperTitle: data.PaperTitle,
      venue: data.venue,
      year: data.year,
      journal_name: data.journal_name,
      journal_pages: data.journal_pages,
      journal_vol: data.journal_vol,
      authors: data.authors,
      doi: data.doi,
      link: data.link,
      reviewerName: userName,
      createdBy: userId,
      imageUrl: url,
      tags: delEmpty_tag(data.Tags),
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

  const onChangeTitleHandler = async (e: { target: { value: string } }) => {
    form.setValue("PaperTitle", e.target.value);
  };
  const onChangeContentsHandler = async (e: { target: { value: string } }) => {
    form.setValue("ReviewContents", e.target.value);
  };
  const onChangeVenueHandler = async (e: { target: { value: string } }) => {
    form.setValue("venue", e.target.value);
  };
  const onChangeYearHandler = async (e: { target: { value: string } }) => {
    form.setValue("year", e.target.value);
  };
  const onChangeJnameHandler = async (e: { target: { value: string } }) => {
    form.setValue("journal_name", e.target.value);
  };
  const onChangeJpageHandler = async (e: { target: { value: string } }) => {
    form.setValue("journal_pages", e.target.value);
  };
  const onChangeJvolHandler = async (e: { target: { value: string } }) => {
    form.setValue("journal_vol", e.target.value);
  };
  const onChangeAuthorsHandler = async (e: { target: { value: string } }) => {
    form.setValue("authors", e.target.value);
  };
  const onChangeDoiHandler = async (e: { target: { value: string } }) => {
    form.setValue("doi", e.target.value);
  };
  const onChangeLinkHandler = async (e: { target: { value: string } }) => {
    form.setValue("link", e.target.value);
  };
  const onChangeTagsHandler = async (e: { target: { value: string } }) => {
    form.setValue("Tags", e.target.value);
  };

  // フォームのレンダリングを行う
  return (
    <Form {...form}>
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
              name="PaperTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-row gap-1">
                    論文名
                    <p className="text-red-600">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="論文のタイトルを入力してください。"
                      {...field}
                      //   value={inputTitle}
                      onChange={onChangeTitleHandler}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-row gap-1">
                    著者名<p className="text-red-600">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="著者名を入力してください。"
                      {...field}
                      onChange={onChangeAuthorsHandler}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-row gap-1">
                    発表年<p className="text-red-600">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="発表された年を入力してください。"
                      {...field}
                      onChange={onChangeYearHandler}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isPreview ? (
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
            ) : (
              <>
                <p className="text-sm font-medium">プレビュー</p>
                <Card>
                  <CardContent className="markdown">
                    <ReactMarkDown>
                      {form.getValues("ReviewContents")}
                    </ReactMarkDown>
                  </CardContent>
                </Card>
              </>
            )}

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>学術会議の名前</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="会議名を入力してください。"
                      {...field}
                      onChange={onChangeVenueHandler}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="journal_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>雑誌名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="雑誌名を入力してください。"
                      {...field}
                      onChange={onChangeJnameHandler}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="journal_pages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ページ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="雑誌でのページを入力してください。"
                      {...field}
                      onChange={onChangeJpageHandler}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="journal_vol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>巻数</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="雑誌での巻数を入力してください。"
                      {...field}
                      onChange={onChangeJvolHandler}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DOI</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="DOIを入力してください。"
                      {...field}
                      onChange={onChangeDoiHandler}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="URLを入力してください。"
                      {...field}
                      onChange={onChangeLinkHandler}
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
                {form.getValues("PaperTitle")}
              </CardTitle>
              <CardDescription>{form.getValues("authors")}</CardDescription>
              <CardDescription>
                {form.getValues("journal_name") ? form.getValues("journal_name") + "." : ""}
                {form.getValues("year") ? form.getValues("year") + "." : ""}
                {form.getValues("journal_vol") ? form.getValues("journal_vol") + "." : ""}
                {form.getValues("journal_pages") ? form.getValues("journal_pages") + "." : ""}
              </CardDescription>
              {(form.getValues("doi") || form.getValues("link")) && (
                <div className="flex flex-row gap-2 py-3">
                  {form.getValues("doi") && <SiDoi size="2rem" />}
                  {form.getValues("link") && <IoIosPaper size="2rem" />}
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