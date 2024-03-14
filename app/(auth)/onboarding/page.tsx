import { OnboadingForm } from '@/components/form/OnboardingForm'
import { currentUser } from '@clerk/nextjs'
import React from 'react'

const page = async () => {
  const user = await currentUser();
  if(!user) return null

  return (
    <div className='flex flex-col mt-5'>
      <h1 className='text-3xl font-bold mb-5'>
        ユーザー登録
      </h1>
      <OnboadingForm userId={user.id} />
    </div>
  )
}

export default page