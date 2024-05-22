import { fetchUser } from "@/actions/user.action";
import Image from "next/image";
import React from "react";
import icon from "@/public/icon.png";
import Link from "next/link";
import { CardContent } from "./ui/card";

type Props = {
  userId?: string;
};

const ReviewUserInfo = async ({ userId }: Props) => {
  if (!userId) return null;

  const userInfo = await fetchUser(userId);

  return (
    <CardContent>
      <Link
        href={`/user/${userInfo[0].id}`}
        className="flex text-blue-400 hover:text-blue-600 underline gap-2"
      >
        <Image
          src={icon}
          alt="Icon Image"
          className="rounded"
          width={24}
          height={24}
        />
        {userInfo[0].name}
      </Link>
    </CardContent>
  );
};

export default ReviewUserInfo;
