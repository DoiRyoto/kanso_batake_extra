import LabHeader from "@/components/lab/LabHeader";
import MyLabReviews from "@/components/lab/MyLabReviews";
import React from "react";
import Search from "@/components/TagSearchBar";

const page = async ({
  params: { labId },
  searchParams,
}: {
  params: { labId: string };
  searchParams?: { tag?: string };
}) => {
  return (
    <div className="flex flex-col gap-5">
      <LabHeader affiliationId={Number(labId)} />
      <Search placeholder="タグを入力" />
      <MyLabReviews affiliationId={Number(labId)} tag={searchParams?.tag} />
    </div>
  );
};

export default page;
