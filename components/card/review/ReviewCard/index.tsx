"use client";

import React, { useState } from "react";
import ReactMarkDown from "react-markdown";
import remarkBreaks from "remark-breaks";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "../../../ui/separator";
import { Review as ReviewType } from "@/type";
import { ImageModal } from "./ImageModal";
import clsx from "clsx";
import PaperData from "./PaperData";
import ReviewTags from "./ReviewTags";
import ReviewUserInfo from "./ReviewUserInfo";
import ReviewAction from "./ReviewAction";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { deleteLikedReview, setLikedReview } from "@/actions/likes.action";

type Props = {
  reviewData: ReviewType;
  userId?: string;
  clamp?: boolean;
  editable?: boolean;
};

const ReviewCard = ({ reviewData, userId, clamp, editable }: Props) => {
  const [liked, setLiked] = useState(() => {
    if (!userId) return false;
    else return reviewData.liked_user_ids.includes(userId);
  });
  const [loadingLike, setLoadingLike] = useState(false);
  const toggleLike = async () => {
    if (!userId) {
      console.log("no user id");
      return;
    }
    setLoadingLike(true);
    try {
      if (!liked) await setLikedReview(reviewData.id, userId);
      else await deleteLikedReview(reviewData.id, userId);
      setLiked(!liked);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingLike(false);
    }
  };

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
      <ReviewTags tagsData={reviewData.tags} />
      <ReviewUserInfo userInfo={reviewData.user_info} />
      {reviewData.thumbnail_url && (
        <CardContent>
          <ImageModal imageUrl={reviewData.thumbnail_url} />
        </CardContent>
      )}
      {editable && <ReviewAction userId={userId} reviewData={reviewData} />}
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
      <CardFooter>
        {!userId ? (
          <></>
        ) : liked ? (
          <div className="flex gap-2">
            <button onClick={toggleLike} disabled={loadingLike}>
              <FcLike />
            </button>
            <p>{reviewData.liked_user_ids.length}</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={toggleLike} disabled={loadingLike}>
              <FcLikePlaceholder />
            </button>
            <p>{reviewData.liked_user_ids.length}</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
