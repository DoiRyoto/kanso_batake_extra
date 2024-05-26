"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Comment } from "@/type";
import React, { useRef } from "react";
import { setComment } from "@/actions/comment.action";
import { Button } from "../ui/button";

type Props = {
  userId?: string;
  reviewId?: number;
};

const FormSchema = z.object({
  comment: z.string().min(1),
});

export function CommentForm({ userId, reviewId }: Props) {
  const isLoading = useRef(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!reviewId) return null;
    if (!userId) return null;

    isLoading.current = true;

    const commentData: Comment = {
      id: 0,
      content: data.comment,
      user_id: userId,
      review_id: reviewId,
      created_at: Date(),
    };

    try {
      await setComment(commentData);
    } catch (error) {
      console.log(error);
    }
    isLoading.current = false;
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row gap-3"
      >
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
          <Button className="flex-none" disabled>
            Reply
          </Button>
        ) : (
          <Button className="flex-none" type="submit">
            Reply
          </Button>
        )}
      </form>
    </Form>
  );
}
