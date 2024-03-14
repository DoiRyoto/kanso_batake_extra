"use client";

// 必要なライブラリやコンポーネントをインポート
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { commentType } from "@/constants";
import React, { useRef } from "react";
import { setComment } from "@/actions/comment.action";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

// フォームのバリデーションスキーマを定義
const FormSchema = z.object({
  // 各フィールドにバリデーションルールを設定
  comment: z.string().min(1),
});

// ReviewFormコンポーネントを定義
export function CommentForm({
  userId,
  reviewId,
}: {
  userId: string;
  reviewId: string;
}) {
  const isLoading = useRef(false); // ローディング状態を追跡するためのuseRef
  const path = usePathname()

  // useFormフックを使ってフォームを初期化
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema), // zodResolverを使ってバリデーションを設定
    defaultValues: {
      // フォームフィールドのデフォルト値を設定
      comment: "",
    },
  });

  // フォーム送信時の処理を定義
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    isLoading.current = true;

    const commentData: commentType = {
      id: Date.now().toString(), // レビューIDを現在のタイムスタンプで生成
      contents: data.comment,
      userId: userId,
      parentId: reviewId,
    };

    try {
      await setComment(commentData, path);
    } catch (error) {
      console.log(error);
    }
    isLoading.current = false;
    form.reset();
  }

  // フォームのレンダリングを行う
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-3">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex-auto">
              <Input placeholder="コメントを入力してください..." {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        {isLoading.current ? (
          <Button  className="flex-none" disabled>
            Reply
          </Button>
        ) : (
            <Button className="flex-none" type="submit">Reply</Button>
        )}
      </form>
    </Form>
  );
}
