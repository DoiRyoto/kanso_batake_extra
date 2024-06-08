import React from "react";
import Review from "./Review";
import { fetchReview } from "@/actions/review.action";
import { fetchUser } from "@/actions/user.action";

type Props = {
  reviewId?: number;
  clamp?: boolean;
};

const ReviewContainer = async ({ reviewId, clamp }: Props) => {
  if (!reviewId) return null;

  const reviewData = await fetchReview(reviewId);

  return (
    <>
      <Review reviewData={reviewData[0]} clamp={clamp} />
    </>
  );
};

export default ReviewContainer;
