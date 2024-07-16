import React from "react";
import { CardContent } from "./ui/card";
import Link from "next/link";
import { Tag } from "@/type";

type Props = {
  tagsData?: Tag[];
};

const ReviewTags = ({ tagsData }: Props) => {
  if (!tagsData) return null;

  return (
    <>
      <CardContent className="flex gap-2">
        {tagsData.map((tag) => {
          return (
            <Link
              key={tag.id}
              href={`?tag=${tag.name}`}
              className="text-blue-400 hover:text-blue-600"
            >
              #{tag.name}
            </Link>
          );
        })}
      </CardContent>
    </>
  );
};

export default ReviewTags;
