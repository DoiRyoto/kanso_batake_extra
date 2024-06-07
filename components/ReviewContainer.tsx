import React from "react";
import Review from "./Review";
import { getReview } from "@/actions/review.action";
import { fetchUser } from "@/actions/user.action";

type Props = {
  reviewId?: number;
  clamp?: boolean;
};

const ReviewContainer = async ({ reviewId, clamp }: Props) => {
  if (!reviewId) return null;

  const reviewData = await getReview(reviewId);
  const userInfo = await fetchUser(reviewData.user_id);

  return (
    <>
      <Review reviewData={reviewData} userInfo={userInfo[0]} clamp={clamp} />
    </>
  );
};

export default ReviewContainer;
