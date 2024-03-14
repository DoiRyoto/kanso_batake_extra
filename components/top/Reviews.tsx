import { fetchReviewsByFields, fetchReviewsByFilter } from "@/actions/review.action";
import React from "react";
import Review from "../Review";

const Reviews = async ({ fields, tag }: { fields?: string[], tag?: string }) => {
  const reviewsData = tag ? await fetchReviewsByFilter(tag):await fetchReviewsByFields(fields);

  return (
    <>
      {tag ? (
        <div className="flex gap-1 m-1 text-muted-foreground">
          Searching in : <p>{tag}</p>
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        {reviewsData.map((review) => {
          return <Review key={review.id} reviewData={review} clamp={true}/>;
        })}
      </div>
    </>
  );
};

export default Reviews;
