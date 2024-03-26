import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { affiliationInterface } from "@/constants";

const LabCard = async ({
  affiliationData,
}: {
  affiliationData: affiliationInterface;
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="truncate leading-normal">
            <Link
              href={`/lab/${affiliationData.id}`}
              className="flex text-blue-600 hover:text-blue-400 underline"
            >
              {affiliationData.name}
            </Link>
          </CardTitle>
          <Separator />
        </CardHeader>
      </Card>
    </>
  );
};

export default LabCard;
