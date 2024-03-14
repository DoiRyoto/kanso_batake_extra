import React from "react";
import { labType } from "@/constants";
import LabCard from "./LabCard";
import { fetchAllLabs } from "@/actions/lab.action";

const LabLists = async ({ tag } : { tag?: string }) => {
  const labLists: labType[] = await fetchAllLabs();

  return (
    <>
    <p className="text-muted-foreground font-2xl"> 研究室一覧 </p>
    <div className="flex flex-col gap-2">
      {labLists.map((lab) => {
        return <LabCard key={lab.value} labData={lab} />;
      })}
    </div>
    </>
  );
};

export default LabLists;