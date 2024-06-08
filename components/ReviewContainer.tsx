import React from "react";
import Review from "./Review";
import { fetchReview } from "@/actions/review.action";
import { currentUser } from "@clerk/nextjs";

type Props = {
  reviewId?: number;
  clamp?: boolean;
};

const ReviewContainer = async ({ reviewId, clamp }: Props) => {
  if (!reviewId) return null;

  const _user = await currentUser();
  if (!_user) return null;

  const reviewData = await fetchReview(reviewId);

  return (
    <>
      <Review reviewData={reviewData[0]} userId={_user.id} clamp={clamp} />
    </>
  );
};

export default ReviewContainer;
