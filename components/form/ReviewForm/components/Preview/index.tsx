import Review from "@/components/Review";
import { createTags } from "@/lib/utils";
import { Review as ReviewType, User } from "@/type";
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
  userInfo: User;
};

export const Preview = ({ form, userInfo }: Props) => {
  const review: ReviewType = {
    id: 0,
    paper_title: form.getValues("paperTitle"),
    paper_data: {
      id: "",
      venue: form.getValues("venue"),
      year: form.getValues("year"),
      journal_name: form.getValues("journalName"),
      journal_pages: form.getValues("journalPages"),
      journal_vol: form.getValues("journalVol"),
      authors: form.getValues("authors"),
      doi: form.getValues("doi"),
      link: form.getValues("link"),
    },
    tags: createTags(form.getValues("tags"), userInfo.id),
    thumbnail_url: form.getValues("imageUrl"),
    content: form.getValues("reviewContents"),
    user_info: userInfo,
    comments: [],
    created_at: "",
  };
  return (
    <div className="flex flex-col">
      <Review reviewData={review} />
    </div>
  );
};
