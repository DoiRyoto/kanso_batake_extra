import React from "react";
import ReviewCard from "@/components/card/review/ReviewCard";
import { fetchReview } from "@/actions/review.action";
import { currentUser } from "@clerk/nextjs";
import { CommentForm } from "../_components/CommentForm";
import CommentList from "../_components/CommentList";

const page = async ({
  params: { reviewId },
}: {
  params: { reviewId: string };
}) => {
  const _user = await currentUser();
  if (!_user) return null;

  const reviewData = await fetchReview(Number(reviewId));
  return (
    <div className="flex flex-col gap-5">
      <ReviewCard
        reviewData={reviewData}
        clamp={false}
        userId={_user.id}
        editable
      />
      <CommentForm userId={_user.id} reviewId={Number(reviewId)} />
      <CommentList reviewId={Number(reviewId)} />
    </div>
  );
};

export default page;
