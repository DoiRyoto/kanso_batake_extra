import React from "react";
import ReactMarkDown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { Review as ReviewType, User } from "@/type";
import { Modal } from "./review/Modal";
import clsx from "clsx";
import PaperData from "./PaperData";
import ReviewTags from "./ReviewTags";
import ReviewUserInfo from "./ReviewUserInfo";
import ReviewAction from "./ReviewAction";

type Props = {
  reviewData?: ReviewType;
  userInfo?: User;
  clamp?: boolean;
};

const Review = ({ reviewData, userInfo, clamp }: Props) => {
  if (!reviewData) return null;
  if (!userInfo) return null;

  return (
    <Card>
      <CardHeader>
        <Link href={`/review/${reviewData.id}`}>
          <CardTitle className="truncate leading-normal text-blue-600 hover:text-blue-400 hover:underline">
            {reviewData.paper_title}
          </CardTitle>
        </Link>
        <PaperData paperData={reviewData.paper_data} />
        <Separator />
      </CardHeader>
      <ReviewTags reviewId={reviewData.id} />
      <ReviewUserInfo userInfo={userInfo} />
      {reviewData.thumbnail_url && (
        <CardContent>
          <Modal imageUrl={reviewData.thumbnail_url} />
        </CardContent>
      )}
      <ReviewAction userId={userInfo.id} reviewData={reviewData} />
      <CardContent className="markdown">
        <ReactMarkDown
          className={clsx(clamp ? "line-clamp-4" : "")}
          remarkPlugins={[remarkBreaks]}
          components={{
            p: ({ children }) => (
              <p style={{ marginBottom: "1em" }}>{children}</p>
            ),
          }}
        >
          {reviewData.content}
        </ReactMarkDown>
      </CardContent>
    </Card>
  );
};

export default Review;
