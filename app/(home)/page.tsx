import Reviews from "@/components/top/Reviews"
import { Suspense } from "react"
import Search from "@/components/TagSearchBar"

export default async function Home({
    searchParams,
  }: {
    searchParams?: {
      tag?: string
    };}
) {
  return (
    <div className="flex flex-col gap-10 mt-2">
      <div className="flex flex-row gap-20">
        <Search placeholder="タグを入力"/>
      </div>
      <Suspense>
        <Reviews tag={searchParams?.tag}/>
      </Suspense>
    </div>
  )
}
