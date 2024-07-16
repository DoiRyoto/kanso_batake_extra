import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { fetchUser } from "@/actions/user.action";
import { fetchAffiliationsByUserId } from "@/actions/affiliation.action";
import { fetchFieldsByUserId } from "@/actions/field.action";
import { fetchWorksByUserId } from "@/actions/work.action";

type Props = {
  userId?: string;
};

const ReviewHeader = async ({ userId }: Props) => {
  if (!userId) return null;

  const [user, affiliations, fields, works] = await Promise.all([
    fetchUser(userId),
    fetchAffiliationsByUserId(userId),
    fetchFieldsByUserId(userId),
    fetchWorksByUserId(userId),
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate leading-normal">
          {user[0].name}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {affiliations.map((institution) => {
            return <p key={institution.id}>所属: {institution.name}</p>;
          })}
          {fields.map((f) => {
            return <p key={f.id}>分野: {f.name}</p>;
          })}
          <p>役職: {user[0].role}</p>
          {works.map((work) => {
            return (
              <p key={work.id}>
                URL:{" "}
                <a href={work.url || ""} target="_blank">
                  {work.url}
                </a>
              </p>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="break-words whitespace-pre-line"></CardContent>
    </Card>
  );
};

export default ReviewHeader;
