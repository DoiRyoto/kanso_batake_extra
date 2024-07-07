import { fetchUser } from "@/actions/user.action";
import { ReviewForm } from "@/components/form/ReviewForm";
import { currentUser } from "@clerk/nextjs";
import { fetchReview } from "@/actions/review.action";
import React from "react";
import { redirect } from "next/navigation";

const page = async ({
  params: { reviewId },
}: {
  params: { reviewId: string };
}) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = (await fetchUser(user.id))[0];
  const review = await fetchReview(Number(reviewId));

  if (userInfo.id !== review.user_info.id) redirect("/");

  return (
    <div className="w-full">
      <ReviewForm user={userInfo} review={review} mode="edit" />
    </div>
  );
};

export default page;
