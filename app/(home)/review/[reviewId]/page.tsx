import React from "react";
import Review from "@/components/Review";
import { getReview } from "@/actions/review.action";
import { currentUser } from "@clerk/nextjs";
import { CommentForm } from "@/components/review/CommentForm";
import CommentList from "@/components/review/CommentList";
import ReviewContainer from "@/components/ReviewContainer";

const page = async ({
  params: { reviewId },
}: {
  params: { reviewId: number };
}) => {
  const _user = await currentUser();
  if (!_user) return null;

  const reviewData = await getReview(Number(reviewId));
  return (
    <div className="flex flex-col gap-5">
      {/* <Review reviewData={reviewData} clamp={false} userId={_user.id} /> */}
      {/* ReviewContainerでReviewを呼ぶ */}
      <ReviewContainer key={reviewId} reviewId={reviewId} clamp={true} />
      <CommentForm userId={_user.id} reviewId={Number(reviewId)} />
      <CommentList reviewId={Number(reviewId)} />
    </div>
  );
};

export default page;
