"use client";

import { RxHamburgerMenu } from "react-icons/rx";
import { HiOutlineExternalLink } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosCreate } from "react-icons/io";
import { FaCity } from "react-icons/fa";
import { ImLab } from "react-icons/im";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { RiLoginBoxLine } from "react-icons/ri";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { userType } from "@/constants";
import Link from "next/link";

import { useClerk } from "@clerk/nextjs";
import { Kaisei_Tokumin } from "next/font/google";
import clsx from "clsx";
import Image from "next/image";
const kaisei = Kaisei_Tokumin({ weight: "400", subsets: ["cyrillic"] });

export function HeaderContents({ user }: { user?: userType }) {
  const { signOut } = useClerk();

  if (!user) {
    return (
      <Sheet>
        <SheetTrigger asChild className="hover:cursor-pointer">
          <RxHamburgerMenu size={"2rem"} class="transform hover:scale-110"/>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle
              className={clsx(kaisei.className, "flex flex-row items-center")}
            >
              <Image src="/appicon.png" alt="logo" width={30} height={30} />
              感想畑
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col justify-between h-full pb-4 py-5">
            <div className="flex flex-col gap-3">
              <div>
                <Label>意見・感想はこちら</Label>
                <a
                  href="https://forms.gle/PrKwapdJXZniqSZs6"
                  target="_blank"
                  className="block px-2 py-1"
                >
                  <text className="flex flex-row items-center gap-1">
                    Google Form <HiOutlineExternalLink />
                  </text>
                </a>
              </div>
            </div>
            <Link href="/sign-in" className="flex text-lg px-2 py-1 flex-row gap-4 items-center justify-center hover:underline">
              <RiLoginBoxLine />サインイン
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild className="hover:cursor-pointer">
        <RxHamburgerMenu size={"2rem"} class="transform hover:scale-110"/>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle
            className={clsx(kaisei.className, "flex flex-row items-center")}
          >
            <Image src="/appicon.png" alt="logo" width={30} height={30} />
            感想畑
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between h-full pb-4 py-5">
          <div className="flex flex-col gap-3">
            <div>
              <Label>投稿する</Label>
              <SheetClose asChild>
                <Link
                  href={`/create`}
                  className="flex text-lg px-2 py-1 flex-row items-center gap-4 hover:underline"
                >
                  <IoIosCreate /> レビューを作成
                </Link>
              </SheetClose>
            </div>
            <div>
              <Label>閲覧する</Label>
              <SheetClose asChild>
                <Link
                  href={`/`}
                  className="flex text-lg px-2 py-1 flex-row items-center gap-4 hover:underline"
                >
                  <AiOutlineHome /> ホーム
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href={`/user/${user.id}`}
                  className="flex text-lg px-2 py-1 flex-row items-center gap-4 hover:underline"
                >
                  <IoPersonOutline /> マイページ
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href={`/lab/${user.affiliation}`}
                  className="flex text-lg px-2 py-1 flex-row items-center gap-4 hover:underline"
                >
                  <ImLab /> マイラボ
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href={`/lab`}
                  className="flex text-lg px-2 py-1 flex-row items-center gap-4 hover:underline"
                >
                  <FaCity /> 研究室一覧
                </Link>
              </SheetClose>
            </div>
            <div>
              <Label>意見・感想はこちら</Label>
              <a
                href="https://forms.gle/PrKwapdJXZniqSZs6"
                target="_blank"
                className="block px-2 py-1"
              >
                <text className="flex flex-row items-center gap-1">
                  Google Form <HiOutlineExternalLink />
                </text>
              </a>
            </div>
          </div>
          <button onClick={() => signOut()} className="flex text-lg px-2 py-1 flex-row gap-4 items-center justify-center hover:underline">
            <RiLogoutBoxRLine /> サインアウト
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
