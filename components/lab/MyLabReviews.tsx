import React from "react";
import Review from "../Review";
import { fetchReviewsByFilter } from "@/actions/review.action";
import { Review as ReviewType } from "@/type";

type Props = {
  affiliationId?: number;
  tag?: string;
};

const MyLabReviews = async ({ affiliationId, tag }: Props) => {
  if (!affiliationId) return null;

  const reviewsData: ReviewType[] = await fetchReviewsByFilter({
    searchTag: tag,
    affiliationId: affiliationId.toString(),
  });

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
      <div className="flex flex-col gap-2">
        {reviewsData.map((review) => {
          return <Review key={review.id} reviewData={review} clamp={true} />;
        })}
      </div>
    </>
  );
};

export default MyLabReviews;
