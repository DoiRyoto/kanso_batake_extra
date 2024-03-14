import React from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

import { fetchUser } from '@/actions/user.action'

const ReviewHeader = async (
	{ userId } : {userId: string}
) => {
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

		</CardHeader>
		<CardContent className='break-words whitespace-pre-line'>
		</CardContent>
	</Card>
	)
}

export default ReviewHeader