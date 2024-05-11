import { fetchUser } from "@/actions/user.action";
import { ReviewForm } from "@/components/form/ReviewForm";
import { ReviewFormManual } from "@/components/form/ReviewFormManual";
import { SwitchDemo } from "@/components/form/ReviewFormModeChangeSwitch";
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
  const userInfo = await fetchUser(user.id);
  const review = await fetchReview(reviewId);

  if (userInfo.id !== review.createdBy) redirect("/");

  return (
    <div className="w-full">
      <ReviewForm userId={userInfo.id} review={review} mode="edit" />
    </div>
  );
};

export default page;
