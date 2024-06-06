import { fetchReviewsByFilter } from "@/actions/review.action";
import React from "react";
import ReviewContainer from "../ReviewContainer";

type Props = {
  tag?: string;
};

const Reviews = async ({ tag }: Props) => {
  const reviewsData = await fetchReviewsByFilter(tag);
  const reviewIds = reviewsData.map((review) => review.id);
  // const reviewIds = await fetchReviewIdsByFilter(tag);

  return (
    <>
      {tag ? (
        <div className="flex gap-1 m-1 text-muted-foreground">
          Searching in : <p>{tag}</p>
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        {reviewIds.map((reviewId) => {
          return (
            <ReviewContainer key={reviewId} reviewId={reviewId} clamp={true} />
          );
        })}
      </div>
    </>
  );
};

export default Reviews;
