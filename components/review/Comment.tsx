import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { commentInterface } from "@/constants";
import { fetchUser } from "@/actions/user.action";

const Comment = async ({ commentData }: { commentData: commentInterface }) => {
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
