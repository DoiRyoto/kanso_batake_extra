import React from "react";
import { affiliationInterface } from "@/constants";
import LabCard from "./LabCard";
import { fetchAllAffiliations } from "@/actions/affiliation.action";

const LabLists = async () => {
  const affiliations: affiliationInterface[] = await fetchAllAffiliations();

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
