import { fetchTagsByReviewId } from "@/actions/tag.action";
import React from "react";
import { CardContent } from "./ui/card";
import Link from "next/link";

const ReviewTags = async ({ reviewId }: { reviewId: number }) => {
  const tagsData = await fetchTagsByReviewId(reviewId);
  return (
    <>
      <CardContent className="flex gap-2">
        {tagsData.map((tag) => {
          return (
            <Link
              key={tag.id}
              href={`?tag=${tag.name}`}
              className="text-blue-400 hover:text-blue-600"
            >
              #{tag.name}
            </Link>
          );
        })}
      </CardContent>
    </>
  );
};

export default ReviewTags;
