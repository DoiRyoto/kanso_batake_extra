import { Suspense } from "react";
import TagSearchBar from "@/components/input/TagSearchBar";
import TopPageReviews from "./_components/TopPageReviews";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    tag?: string;
  };
}) {
  return (
    <div className="flex flex-col gap-10 mt-2">
      <div className="flex flex-row gap-20">
        <TagSearchBar placeholder="タグを入力" />
      </div>
      <Suspense>
        <TopPageReviews tag={searchParams?.tag} />
      </Suspense>
    </div>
  );
}
