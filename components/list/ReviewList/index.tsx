import React from "react";
import ReviewCard from "@/components/card/review/ReviewCard";
import { Review } from "@/type";
import { currentUser } from "@clerk/nextjs";

type Props = {
  reviewData: Review[];
};

const ReviewList = async ({ reviewData }: Props) => {
  if (reviewData.length === 0) {
    return <div>No Reviews.</div>;
  }
  const _user = await currentUser();

  return (
    <>
      <div className="flex flex-col gap-2">
        {reviewData.map((review) => {
          return (
            <ReviewCard
              key={review.id}
              reviewData={review}
              userId={_user ? _user.id : undefined}
              clamp={true}
            />
          );
        })}
      </div>
    </>
  );
};

export default ReviewList;
