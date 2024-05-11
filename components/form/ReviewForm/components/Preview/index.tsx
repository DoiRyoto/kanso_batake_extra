import Review from "@/components/Review";
import { reviewType } from "@/constants";
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

export const Preview = ({ form }: Props) => {
  const review: reviewType = {
    id: "",
    paperTitle: form.getValues("paperTitle"),
    venue: form.getValues("venue"),
    year: form.getValues("year"),
    journal_name: form.getValues("journalName"),
    journal_pages: form.getValues("journalPages"),
    journal_vol: form.getValues("journalVol"),
    authors: form.getValues("authors"),
    doi: form.getValues("doi"),
    link: form.getValues("link"),
    tags: form.getValues("tags").split(","),
    imageUrl: form.getValues("imageUrl"),
    contents: form.getValues("reviewContents"),
    reviewerName: "",
    reviewerFields: [""],
    createdBy: "Your Name",
  };
  return (
    <div className="flex flex-col">
      <Review reviewData={review} />
    </div>
  );
};
