import React from "react";
import { Affiliation } from "@/type";
import LabCard from "./LabCard";
import { fetchAllAffiliations } from "@/actions/affiliation.action";

const LabLists = async () => {
  const affiliations: Affiliation[] = await fetchAllAffiliations();

  return (
    <>
      <p className="text-muted-foreground font-2xl"> 研究室一覧 </p>
      <div className="flex flex-col gap-2">
        {affiliations.map((affiliation) => {
          return <LabCard key={affiliation.id} affiliationData={affiliation} />;
        })}
      </div>
    </>
  );
};

export default LabLists;
