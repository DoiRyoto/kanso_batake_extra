import LabHeader from '@/components/lab/LabHeader'
import MyLabReviews from '@/components/lab/MyLabReviews'
import { urlDecode } from '@/lib/utils'
import React from 'react'
import Search from "@/components/TagSearchBar"

const page = async(
  { params: { labId }, searchParams } : { params : { labId: string }, searchParams?: { tag?: string }}
) => {
  const labId_decoded = urlDecode(labId)
  return (
    <div className='flex flex-col gap-5'>
      <LabHeader labId={labId_decoded}/>
      <Search placeholder="タグを入力"/>
      <MyLabReviews labId={labId_decoded} tag={searchParams?.tag}/>
    </div>
  )
}

export default page