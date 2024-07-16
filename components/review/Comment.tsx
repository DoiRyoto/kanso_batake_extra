import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { Comment as CommentType } from "@/type";
import { fetchUser } from "@/actions/user.action";

type Props = {
  commentData?: CommentType;
};

const Comment = async ({ commentData }: Props) => {
  if (!commentData) return null;

  const user = (await fetchUser(commentData.user_id))[0];
  return (
    <Card>
      <CardHeader>
        <CardDescription>{user.name}</CardDescription>
        <Separator />
      </CardHeader>
      <CardContent className="break-words whitespace-pre-line">
        {commentData.content}
      </CardContent>
    </Card>
  );
};

export default Comment;
