import { fetchUser } from '@/actions/user.action'
import { ReviewForm } from '@/components/form/ReviewForm'
import { ReviewFormManual } from '@/components/form/ReviewFormManual'
import { SwitchDemo } from '@/components/form/ReviewFormModeChangeSwitch'
import { currentUser } from '@clerk/nextjs'
import { fetchReview } from '@/actions/review.action'
import React from 'react'
import { redirect } from 'next/navigation'

const page = async(
    { params: { reviewId }, searchParams } : { params : { reviewId: string }, searchParams: { mode?: string } }
) => {
  const user = await currentUser()
  if(!user) return null
  const userInfo = await fetchUser(user.id)
  const review = await fetchReview(reviewId)

  if(userInfo.id !== review.createdBy) redirect("/")

  return (
    <div className="mt-7 w-full">
      <SwitchDemo defaultChecked={searchParams.mode !== "manual"}/>
      { (searchParams.mode == "manual") ? 
      <ReviewFormManual userId={user.id} userName={userInfo.name} review={review}/>:
      <ReviewForm userId={user.id} userName={userInfo.name} review={review}/>}
    </div>
  )
}

export default page