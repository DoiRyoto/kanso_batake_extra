"use client";

import { Review } from "@/type";
import React from "react";
import { FaRegEdit } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "./ui/button";
import { deleteReview } from "@/actions/review.action";
import { CardContent } from "./ui/card";

type Props = {
  reviewData?: Review;
  userId?: string;
};

const ReviewAction = ({ reviewData, userId }: Props) => {
  if (!userId || !reviewData) return null;

  const deleteButtonClickHandler = async () => {
    await deleteReview(reviewData, userId);
  };

  return (
    <CardContent>
      {userId === reviewData.user_info.id && (
        <div className="flex flex-row gap-2 py-3">
          {userId == reviewData.user_info.id && (
            <a href={`/edit/${reviewData.id}`} target="">
              <FaRegEdit size="2rem" />
            </a>
          )}

          {userId === reviewData.user_info.id && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <a target="_blank">
                    <FaRegTrashCan size="2rem" />
                  </a>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      レビューを削除しますか？
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      この操作は元に戻せません。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button onClick={deleteButtonClickHandler}>
                        投稿を削除する
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      )}
    </CardContent>
  );
};

export default ReviewAction;
