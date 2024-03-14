import React from "react";
import { fetchCommentsByReviewId } from "@/actions/comment.action";
import Comment from "./Comment";

const CommentList = async ({ reviewId }: { reviewId: string }) => {
  const comments = await fetchCommentsByReviewId(reviewId)

  return (
    <div className="flex flex-col gap-2">
      {comments.map((comment) => {
        return <Comment key={comment.id} commentData={comment}/>;
      })}
    </div>
  );
};

export default CommentList;
