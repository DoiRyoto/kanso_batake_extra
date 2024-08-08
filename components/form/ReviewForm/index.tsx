"use client";

import { Form } from "@/components/ui/form";
import { multiStepFormNavItemList } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PaperDataForm } from "./components/PaperDataForm";
import { ReviewAndTagForm } from "./components/ReviewAndTagForm";
import { ImageForm } from "./components/ImageForm";
import { Preview } from "./components/Preview";
import { uploadImage } from "@/actions/image.action";
import { createTags } from "@/lib/utils";
import { setReview, updateReview } from "@/actions/review.action";
import { Button } from "@/components/ui/button";
import MultiStepFormNavBar from "../MultiStepFormNavBar";
import { Review, User } from "@/type";
import { useRouter } from "next/navigation";

type Props = {
  user?: User;
  mode?: "create" | "edit";
  review?: Review;
};

const MIN_STEP = 1;
const MAX_STEP = multiStepFormNavItemList.length;

const FormSchema = z.object({
  doi: z.string(),
  paperTitle: z.string().min(1, {
    message: "論文名は入力必須です。",
  }),
  authors: z.string(),
  year: z.string(),
  venue: z.string(),
  journalName: z.string(),
  journalPages: z.string(),
  journalVol: z.string(),
  link: z.string(),
  reviewContents: z.string().min(1, {
    message: "レビューは入力必須です。",
  }),
  tags: z.string(),
  imageUrl: z.string(),
});

export const ReviewForm = ({ review, user, mode = "create" }: Props) => {
  const router = useRouter();
  const isLoading = useRef(false); // ローディング状態を追跡するためのuseRef
  const [step, setStep] = useState<number>(MIN_STEP);
  const [files, setFiles] = useState<File[]>([]);
  const currentLabel = multiStepFormNavItemList.find(
    (item) => item.step === step,
  )?.label;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      doi: review && review.paper_data.doi ? review.paper_data.doi : "",
      paperTitle: review && review.paper_title,
      authors:
        review && review.paper_data.authors ? review.paper_data.authors : "",
      year:
        review && review.paper_data.year
          ? review.paper_data.year.toString()
          : "",
      venue: review && review.paper_data.venue ? review.paper_data.venue : "",
      journalName:
        review && review.paper_data.journal_name
          ? review.paper_data.journal_name
          : "",
      journalPages:
        review && review.paper_data.journal_pages
          ? review.paper_data.journal_pages
          : "",
      journalVol:
        review && review.paper_data.journal_vol
          ? review.paper_data.journal_vol
          : "",
      link: review && review.paper_data.link ? review.paper_data.link : "",
      reviewContents: review && review.content ? review.content : "",
      tags: review && review.tags ? review.tags.toString() : "",
      imageUrl: review && review.thumbnail_url ? review.thumbnail_url : "",
    },
  });

  if (!user) return null;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user) return null;

    isLoading.current = true;

    const id = review && review.id ? review.id : Date.now(); // レビューIDを現在のタイムスタンプで生成
    const url = files[0]
      ? await uploadImage(files[0], id)
      : review?.thumbnail_url;

    // 提出用のレビューデータを準備
    const reviewData: Review = {
      id: id,
      content: data.reviewContents,
      paper_title: data.paperTitle,
      paper_data: {
        venue: data.venue,
        year: data.year,
        journal_name: data.journalName,
        journal_pages: data.journalPages,
        journal_vol: data.journalVol,
        authors: data.authors,
        doi: data.doi,
        link: data.link,
      },
      comments: [],
      user_info: user,
      created_at: Date(),
      tags: createTags(data.tags),
      thumbnail_url: url || "",
    };
    try {
      if (mode === "create") {
        await setReview(reviewData);
      } else if (mode === "edit") {
        await updateReview(reviewData);
      }
    } catch (error) {
      console.log(error);
    }

    router.back();
  }

  return (
    <main className="flex flex-col">
      <MultiStepFormNavBar currentStep={step} setStep={setStep} />
      <div className="px-8">
        <div className="px-8">
          <div className="p-8">
            <div className="flex flex-col pb-4 border-b border-slate-500 font-size">
              <p className="text-slate-500 text-xs/[24px] font-normal text-start">
                Step {step}/{MAX_STEP}
              </p>
              <p className="text-black text-2xl text-start font-semibold">
                {currentLabel}
              </p>
            </div>
            <Form {...form}>
              <form className="pt-8" onSubmit={form.handleSubmit(onSubmit)}>
                {step === 1 && <PaperDataForm form={form} />}
                {step === 2 && <ReviewAndTagForm form={form} />}
                {step === 3 && <ImageForm form={form} setFiles={setFiles} />}
                {step === 4 && <Preview form={form} userInfo={user} />}
                <div className="flex flex-row justify-end pt-8 gap-8">
                  {step !== MIN_STEP && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(Math.max(step - 1, MIN_STEP))}
                    >
                      Back
                    </Button>
                  )}
                  {step !== MAX_STEP && (
                    <Button
                      type="button"
                      onClick={() => setStep(Math.min(step + 1, 4))}
                    >
                      Next Step
                    </Button>
                  )}
                  {step === MAX_STEP && (
                    <Button type="submit" disabled={isLoading.current}>
                      Post Review
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};
