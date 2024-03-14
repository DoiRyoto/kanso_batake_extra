import ReviewHeader from '@/components/user/ReviewerHeader'
import ReviewsByUser from '@/components/user/ReviewsByUser'
import React from 'react'
import Search from '@/components/TagSearchBar';

const page = async(
  { params: { userId }, searchParams } : { params : { userId: string }, searchParams?: { tag?: string }}
) => {
  return (
    <div className='flex flex-col gap-5'>
      <ReviewHeader userId={userId}/>
      <Search placeholder="タグを入力"/>
      <ReviewsByUser userId={userId} tag={searchParams?.tag} />
    </div>
  )
}

export default page