import { fetchReviewsByFilter } from "@/actions/review.action";
import React from "react";
import Review from "../Review";
import { fetchUser } from "@/actions/user.action";

type Props = {
  userId?: string;
  tag?: string;
};

const ReviewsByUser = async ({ userId, tag }: Props) => {
  if (!userId) return null;

  const [reviewsData] = await Promise.all([fetchReviewsByFilter(tag, userId)]);

  if (reviewsData.length === 0) {
    return <div>No Reviews.</div>;
  }

  return (
    <>
      {tag && (
        <div className="flex gap-1 m-1 text-muted-foreground">
          Searching in : <p>{tag}</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {reviewsData.map((review) => {
          return <Review key={review.id} reviewData={review} clamp={true} />;
        })}
      </div>
    </>
  );
};

export default ReviewsByUser;
