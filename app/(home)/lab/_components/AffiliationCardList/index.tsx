import React from "react";
import { Affiliation } from "@/type";
import { fetchAllAffiliations } from "@/actions/affiliation.action";
import AffiliationCard from "../AffiliationCard";

const AffiliationCardList = async () => {
  const affiliations: Affiliation[] = await fetchAllAffiliations();

  return (
    <>
      <p className="text-muted-foreground font-2xl"> 研究室一覧 </p>
      <div className="flex flex-col gap-2">
        {affiliations.map((affiliation) => {
          return (
            <AffiliationCard
              key={affiliation.id}
              affiliationData={affiliation}
            />
          );
        })}
      </div>
    </>
  );
};

export default AffiliationCardList;
