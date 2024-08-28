import AffiliationHeader from "../_components/AffiliationHeader";
import ReviewListByAffiliation from "../_components/ReviewListByAffiliation";
import React from "react";
import TagSearchBar from "@/components/input/TagSearchBar";

const page = async ({
  params: { labId },
  searchParams,
}: {
  params: { labId: string };
  searchParams?: { tag?: string };
}) => {
  return (
    <div className="flex flex-col gap-5">
      <AffiliationHeader affiliationId={Number(labId)} />
      <TagSearchBar placeholder="タグを入力" />
      <ReviewListByAffiliation
        affiliationId={Number(labId)}
        tag={searchParams?.tag}
      />
    </div>
  );
};

export default page;
