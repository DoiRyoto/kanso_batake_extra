import React from "react";
import Review from "@/components/Review";
import { fetchReview } from "@/actions/review.action";
import { currentUser } from "@clerk/nextjs";
import { CommentForm } from "@/components/review/CommentForm";
import CommentList from "@/components/review/CommentList";

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
      <Review reviewData={reviewData} clamp={false} userId={_user.id} />
      <CommentForm userId={_user.id} reviewId={Number(reviewId)} />
      <CommentList reviewId={Number(reviewId)} />
    </div>
  );
};

export default page;
