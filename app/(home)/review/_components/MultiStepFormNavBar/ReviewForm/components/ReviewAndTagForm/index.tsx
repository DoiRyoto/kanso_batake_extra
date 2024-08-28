import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { UseFormReturn } from "react-hook-form";

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

export const ReviewAndTagForm = ({ form }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="reviewContents"
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
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>タグ</FormLabel>
            <FormControl>
              <Input placeholder="ex) HCI,Visualization,AI" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
