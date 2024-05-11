"use client";

import { Form } from "@/components/ui/form";
import { multiStepFormNavItemList, reviewType, userType } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PaperDataForm } from "./components/PaperDataForm";
import { ReviewAndTagForm } from "./components/ReviewAndTagForm";
import { ImageForm } from "./components/ImageForm";
import { Preview } from "./components/Preview";
import { uploadImage } from "@/actions/image.action";
import { delEmpty_tag } from "@/lib/utils";
import { setReview, updateReview } from "@/actions/review.action";
import { Button } from "@/components/ui/button";
import MultiStepFormNavBar from "../MultiStepFormNavBar";

type Props = {
  user: userType;
  mode?: "create" | "edit";
  review?: reviewType;
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
  const isLoading = useRef(false); // ローディング状態を追跡するためのuseRef
  const [step, setStep] = useState<number>(MIN_STEP);
  const [files, setFiles] = useState<File[]>([]);
  const currentLabel = multiStepFormNavItemList.find(
    (item) => item.step === step
  )?.label;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      doi: review && review.doi ? review.doi : "",
      paperTitle: review && review.paperTitle ? review.paperTitle : "",
      authors: review && review.authors ? review.authors : "",
      year: review && review.year ? review.year.toString() : "",
      venue: review && review.venue ? review.venue : "",
      journalName: review && review.journal_name ? review.journal_name : "",
      journalPages: review && review.journal_pages ? review.journal_pages : "",
      journalVol: review && review.journal_vol ? review.journal_vol : "",
      link: review && review.link ? review.link : "",
      reviewContents: review && review.contents ? review.contents : "",
      tags: review && review.tags ? review.tags.toString() : "",
      imageUrl: review && review.imageUrl ? review.imageUrl : "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    isLoading.current = true;

    const id = review && review.id ? review.id : Date.now().toString(); // レビューIDを現在のタイムスタンプで生成
    const url = files[0] ? await uploadImage(files[0], id) : review?.imageUrl;
    const userName = user.name;
    const reviewerFields: string[] = user.field;

    // 提出用のレビューデータを準備
    const reviewData: reviewType = {
      id: id,
      contents: data.reviewContents,
      paperTitle: data.paperTitle,
      venue: data.venue,
      year: data.year,
      journal_name: data.journalName,
      journal_pages: data.journalPages,
      journal_vol: data.journalVol,
      authors: data.authors,
      doi: data.doi,
      link: data.link,
      reviewerName: userName,
      reviewerFields: reviewerFields,
      createdBy: user.id,
      tags: delEmpty_tag(data.tags),
      imageUrl: url || "",
    };

    try {
      if (mode === "create") {
        await setReview(user.id, reviewData);
      } else if (mode === "edit") {
        await updateReview(user.id, reviewData);
      }
    } catch (error) {
      console.log(error);
    }
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
                {step === 4 && <Preview form={form} />}
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
