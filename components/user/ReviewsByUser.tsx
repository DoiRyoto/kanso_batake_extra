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

  const [reviewsData, userInfo] = await Promise.all([
    fetchReviewsByFilter(tag, userId),
    fetchUser(userId),
  ]);

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
          return (
            <Review
              key={review.id}
              reviewData={review}
              userInfo={userInfo[0]}
              clamp={true}
            />
          );
        })}
      </div>
    </>
  );
};

export default ReviewsByUser;
