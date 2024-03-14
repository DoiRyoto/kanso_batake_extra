import { fetchUser } from '@/actions/user.action';
import { ProfileEdittingForm } from '@/components/form/ProfileEdittingForm';
import { currentUser } from '@clerk/nextjs'
import React from 'react'

const page = async(
  { params: { userId }} : { params : { userId: string }}
) => {
  const user = await fetchUser(userId);
  if(!user){
    return null
  } 

  return (
    <section className='flex flex-col mt-5'>
      <h1 className='text-3xl font-bold mb-5'>
        ユーザー情報
      </h1>
      <ProfileEdittingForm user={user} />
    </section>
  )
}

export default page