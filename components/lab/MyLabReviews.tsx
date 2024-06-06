import React from "react";
import Review from "../Review";
import { fetchReviewsByAffiliationId } from "@/actions/review.action";
import { Review as ReviewType } from "@/type";
import ReviewContainer from "../ReviewContainer";

type Props = {
  affiliationId?: number;
  tag?: string;
};

const MyLabReviews = async ({ affiliationId, tag }: Props) => {
  if (!affiliationId) return null;

  const reviewsData: ReviewType[] = await fetchReviewsByAffiliationId(
    affiliationId
  );

  if (reviewsData.length === 0) {
    return <div>No Reviews.</div>;
  }

  const reviewIds = reviewsData.map((review) => review.id);
  // const reviewIds = await fetchReviewIdsByAffiliationId(tag);

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

export default MyLabReviews;
