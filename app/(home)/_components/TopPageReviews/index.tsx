import { fetchReviewsByFilter } from "@/actions/review.action";
import React from "react";
import ReviewList from "@/components/list/ReviewList";

type Props = {
  tag?: string;
};

const TopPageReviews = async ({ tag }: Props) => {
  const reviewsData = await fetchReviewsByFilter(tag);

  return (
    <>
      {tag ? (
        <div className="flex gap-1 m-1 text-muted-foreground">
          Searching in : <p>{tag}</p>
        </div>
      ) : null}
      <ReviewList reviewData={reviewsData} />
    </>
  );
};

export default TopPageReviews;
