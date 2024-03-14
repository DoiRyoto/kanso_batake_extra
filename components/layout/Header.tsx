import { fetchUser } from '@/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { HeaderContents } from './HeaderContents';
import { Kaisei_Tokumin } from "next/font/google"
import clsx from 'clsx';

const kaisei = Kaisei_Tokumin({weight: "400", subsets: ["cyrillic"]})

const Header = async () => {
  const _user = await currentUser();
  const user = _user ? await fetchUser(_user.id) : undefined

  return (
    <header className='fixed z-50 w-screen justify-center border-b'>
      <div className='container flex flex-row max-w-5xl justify-between py-2 bg-white dark:bg-black items-center'>
          <Link href="/" className={clsx(kaisei.className, "text-2xl flex flex-row items-center justify-center")}>
            <Image src="/appicon.png" width={50} height={50} alt="logo"/>
            感想畑
          </Link>
          <HeaderContents user={user} />
      </div>
    </header>
  )
}

export default Header