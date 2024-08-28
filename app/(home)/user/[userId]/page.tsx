import UserHeader from "../_components/UserHeader";
import ReviewListByUser from "../_components/ReviewListByUser";
import React, { Suspense } from "react";
import Search from "@/components/input/TagSearchBar";

const page = async ({
  params: { userId },
  searchParams,
}: {
  params: { userId: string };
  searchParams?: { tag?: string };
}) => {
  return (
    <div className="flex flex-col gap-5">
      <Suspense>
        <UserHeader userId={userId} />
      </Suspense>
      <Search placeholder="タグを入力" />
      <Suspense>
        <ReviewListByUser userId={userId} tag={searchParams?.tag} />
      </Suspense>
    </div>
  );
};

export default page;
