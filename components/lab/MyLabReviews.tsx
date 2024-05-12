import React from "react";
import Review from "../Review";
import { reviewInterface } from "@/constants";
import { fetchReviewsByAffiliationId } from "@/actions/review.action";

const MyLabReviews = async ({
  affiliationId,
  tag,
}: {
  affiliationId: number;
  tag?: string;
}) => {
  const reviewsData: reviewInterface[] = await fetchReviewsByAffiliationId(
    affiliationId
  );

  if (reviewsData.length == 0) {
    return <div>No Reviews.</div>;
  }
  return (
    <>
      {tag ? (
        <div className="flex gap-1 m-1 text-muted-foreground">
          Searching in : <p>{tag}</p>
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        {reviewsData.map((review) => {
          return <Review key={review.id} reviewData={review} clamp={true} />;
        })}
      </div>
    </>
  );
};

export default MyLabReviews;
