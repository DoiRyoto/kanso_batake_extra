import Image from "next/image";
import React from "react";
import icon from "@/public/icon.png";
import Link from "next/link";
import { CardContent } from "./ui/card";
import { User } from "@/type";

type Props = {
  userInfo?: User;
};

const ReviewUserInfo = ({ userInfo }: Props) => {
  if (!userInfo) return null;

  return (
    <CardContent>
      <Link
        href={`/user/${userInfo.id}`}
        className="flex text-blue-400 hover:text-blue-600 underline gap-2"
      >
        <Image
          src={icon}
          alt="Icon Image"
          className="rounded"
          width={24}
          height={24}
        />
        {userInfo.name}
      </Link>
    </CardContent>
  );
};

export default ReviewUserInfo;
