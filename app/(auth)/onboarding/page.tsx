import { fetchAllAffiliations } from "@/actions/affiliation.action";
import { fetchAllFields } from "@/actions/field.action";
import { OnboadingForm } from "@/components/form/OnboardingForm";
import { currentUser } from "@clerk/nextjs";
import React from "react";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const [fieldData, affiliationData] = await Promise.all([
    fetchAllFields(),
    fetchAllAffiliations(),
  ]);

  return (
    <div className="flex flex-col mt-5">
      <h1 className="text-3xl font-bold mb-5">ユーザー登録</h1>
      <OnboadingForm
        userId={user.id}
        fieldData={fieldData}
        affiliationData={affiliationData}
      />
    </div>
  );
};

export default page;
