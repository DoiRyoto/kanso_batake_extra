import React from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

import { fetchUser } from '@/actions/user.action'
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';

const ReviewHeader = async (
	{ userId } : {userId: string}
) => {
	const currentuser = await currentUser();
	const user = await fetchUser(userId)
  
	return ( 
	<Card>
		<CardHeader>
			<CardTitle className="truncate leading-normal">
				{user.name}
			</CardTitle>
			<div className='text-sm text-muted-foreground'>
				{user.affiliation.map((institution) => {
						return (<p key={institution}>所属: {institution}</p>)
					})}
				{user.field.map((f) => {
						return (<p key={f}>分野: {f}</p>)
					})}
				<p>役職: { user.role }</p>
				{user.works.map((work) => {
						return (<p key={work}>URL: <a href={work} target='_blank'>{work}</a></p>)
					})}
			</div>
			<div className="flex flex-row-reverse leading-normal text-blue-600 hover:text-blue-400 hover:underline">
				{userId === currentuser?.id && (
					<Link href={`/profile/${userId}`}>
						ユーザ情報を編集する
					</Link>
				)}
			</div>
		</CardHeader>
		<CardContent className='break-words whitespace-pre-line'>
			
		</CardContent>
	</Card>
	)
}

export default ReviewHeader