import { Paper, Review } from "@/type";
import React from "react";
import { CardDescription } from "./ui/card";
import { SiDoi } from "react-icons/si";
import { IoIosPaper } from "react-icons/io";

type Props = {
  paperData?: Paper;
};

const PaperData = ({ paperData }: Props) => {
  if (!paperData) return null;

  return (
    <>
      <CardDescription>{paperData.authors}</CardDescription>
      <CardDescription>
        {paperData.journal_name ? paperData.journal_name + "." : ""}
        {paperData.year ? paperData.year + "." : ""}
        {paperData.journal_vol ? paperData.journal_vol + "." : ""}
        {paperData.journal_pages ? paperData.journal_pages + "." : ""}
      </CardDescription>
      {(paperData.doi || paperData.link) && (
        <div className="flex flex-row gap-2 py-3">
          {paperData.doi && (
            <a
              href={`https://www.doi.org/${paperData.doi}`}
              target="_blank"
              className="transform hover:scale-110 motion-reduce:transform-none"
            >
              <SiDoi size="2rem" />
            </a>
          )}
          {paperData.link && (
            <a
              href={`${paperData.link}`}
              target="_blank"
              className="transform hover:scale-110 motion-reduce:transform-none"
            >
              <IoIosPaper size="2rem" />
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default PaperData;
