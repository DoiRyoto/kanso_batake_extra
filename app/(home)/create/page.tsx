import { fetchUser } from "@/actions/user.action";
import { ReviewForm } from "@/components/form/ReviewForm";
import { currentUser } from "@clerk/nextjs";
import React from "react";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = (await fetchUser(user.id))[0];

  return (
    <div className="w-full">
      <ReviewForm user={userInfo} mode="create" />
    </div>
  );
};

export default page;
