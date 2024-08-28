import React from "react";
import { fetchReviewsByFilter } from "@/actions/review.action";
import { Review as ReviewType } from "@/type";
import ReviewList from "@/components/list/ReviewList";

type Props = {
  affiliationId?: number;
  tag?: string;
};

const ReviewListByAffiliation = async ({ affiliationId, tag }: Props) => {
  if (!affiliationId) return null;

  const reviewsData: ReviewType[] = await fetchReviewsByFilter(
    "",
    "",
    affiliationId.toString()
  );

  if (reviewsData.length === 0) {
    return <div>No Reviews.</div>;
  }

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

export default ReviewListByAffiliation;
