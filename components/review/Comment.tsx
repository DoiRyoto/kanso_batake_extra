import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { commentType } from "@/constants";
import { fetchUser } from "@/actions/user.action";

const Comment = async ({ commentData }: { commentData: commentType }) => {
  const user = await fetchUser(commentData.userId);
  return (
    <Card>
      <CardHeader>
        <CardDescription>{user.name}</CardDescription>
        <Separator />
      </CardHeader>
      <CardContent className="break-words whitespace-pre-line">{commentData.contents}</CardContent>
    </Card>
  );
};

export default Comment;
