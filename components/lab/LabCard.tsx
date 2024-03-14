import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { labType } from "@/constants";

const LabCard = ({ labData }: { labData: labType }) => {
  return (
    <>
    {labData.users.length > 0 ? (
    <Card>
      <CardHeader>
        <CardTitle className="truncate leading-normal">
            <Link  href={`/lab/${labData.value}`} className="flex text-blue-600 hover:text-blue-400 underline">
            {labData.value}
            </Link>
        </CardTitle>
        <CardDescription>     
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent className="flex gap-2">
      </CardContent> 
    </Card>
    ):null}
    </>
  );
};

export default LabCard;
