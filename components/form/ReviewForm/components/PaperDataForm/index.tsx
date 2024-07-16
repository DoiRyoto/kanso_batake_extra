import { fetchPaperByDOI } from "@/actions/paper.action";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  form: UseFormReturn<
    {
      paperTitle: string;
      venue: string;
      year: string;
      journalName: string;
      journalPages: string;
      journalVol: string;
      authors: string;
      doi: string;
      link: string;
      tags: string;
      imageUrl: string;
      reviewContents: string;
    },
    any,
    undefined
  >;
};

export const PaperDataForm = ({ form }: Props) => {
  const { toast } = useToast();

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

    form.setValue("paperTitle", paperData.title);
    form.setValue("venue", paperData.venue || "");
    form.setValue("year", paperData.year.toString() || "");
    form.setValue("journalName", paperData.journal.name || "");
    form.setValue("journalPages", paperData.journal.pages || "");
    form.setValue("journalVol", paperData.journal.vol || "");
    form.setValue("authors", paperData.authors[0].name || "");
    form.setValue("link", paperData.url || "");
  }, 1000);

  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="doi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>DOI</FormLabel>
            <FormControl>
              <Input
                placeholder="10.xxxx/xxxxxxxxxxxx"
                {...field}
                onChangeCapture={onChageHandler}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="paperTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex flex-row gap-1">
              論文名
              <p className="text-red-600">*</p>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="ex) Best practices for sharing article reviews"
                {...field}
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
            <FormLabel>著者名</FormLabel>
            <FormControl>
              <Input placeholder="ex) Batake Kanso" {...field} />
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
            <FormLabel>発表年</FormLabel>
            <FormControl>
              <Input placeholder="ex) 2024" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="venue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>学術会議の名前</FormLabel>
            <FormControl>
              <Input placeholder="ex) conference of kanso batake" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="journalName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>雑誌名</FormLabel>
            <FormControl>
              <Input placeholder="ex) journal of kanso batake" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="journalPages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ページ</FormLabel>
            <FormControl>
              <Input placeholder="ex) 42-48" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="journalVol"
        render={({ field }) => (
          <FormItem>
            <FormLabel>巻数</FormLabel>
            <FormControl>
              <Input placeholder="ex) 2" {...field} />
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
                placeholder="ex) https://kanso-batake.vercel.app/"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
