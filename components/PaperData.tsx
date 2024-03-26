import { reviewInterface } from "@/constants";
import React from "react";
import { CardDescription } from "./ui/card";
import { SiDoi } from "react-icons/si";
import { IoIosPaper } from "react-icons/io";

const PaperData = ({ reviewData }: { reviewData: reviewInterface }) => {
  return (
    <>
      <CardDescription>{reviewData.paper_data.authors}</CardDescription>
      <CardDescription>
        {reviewData.paper_data.journal_name
          ? reviewData.paper_data.journal_name + "."
          : ""}
        {reviewData.paper_data.year ? reviewData.paper_data.year + "." : ""}
        {reviewData.paper_data.journal_vol
          ? reviewData.paper_data.journal_vol + "."
          : ""}
        {reviewData.paper_data.journal_pages
          ? reviewData.paper_data.journal_pages + "."
          : ""}
      </CardDescription>
      {(reviewData.paper_data.doi || reviewData.paper_data.link) && (
        <div className="flex flex-row gap-2 py-3">
          {reviewData.paper_data.doi && (
            <a
              href={`https://www.doi.org/${reviewData.paper_data.doi}`}
              target="_blank"
              className="transform hover:scale-110 motion-reduce:transform-none"
            >
              <SiDoi size="2rem" />
            </a>
          )}
          {reviewData.paper_data.link && (
            <a
              href={`${reviewData.paper_data.link}`}
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
