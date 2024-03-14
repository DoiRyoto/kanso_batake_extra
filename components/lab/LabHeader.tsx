import React from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  

import { fetchUser } from '@/actions/user.action'
import { fetchUserIdsByLabId } from '@/actions/user.action'
import { fetchUsers } from '@/actions/user.action'
import { userType } from '@/constants'


const LabHeader = async (
	{ labId } : {labId: string}
) => {
  const userIds:string[] = await fetchUserIdsByLabId(labId)
	const users:userType[] = await fetchUsers(userIds)
  let teachers: userType[] = []
  let students: userType[] = []

  // teacherとstudentに仕分け
  users.map((user) => {
    switch (user.role) {
      case '教員':
        teachers.push(user);
        break;
      case '学生':
        students.push(user);
        break;
    }
  });

  return ( 
    <Card>
      <CardHeader>
        <CardTitle className="truncate leading-normal">
          {labId}
        </CardTitle>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
          <AccordionTrigger className="
          text-muted-foreground font-bold text-xl">メンバー一覧</AccordionTrigger>
          <AccordionContent>
            <div className='text-base text-muted-foreground'>
              <div className="flex flex-row">
                <p className="font-bold whitespace-nowrap">教員：</p>
                <div className="flex flex-wrap whitespace-nowrap gap-4">
                {teachers.map((teacher) => {
                  return (
                    <Link href={`/user/${teacher.id}`} className="hover:text-gray-400">
                    {teacher.name}
                    </Link>
                    
                  )
                })}
                </div>
              </div>
              <div className="flex flex-row">
                <p className="font-bold whitespace-nowrap">学生：</p>
                <div className="flex flex-wrap whitespace-nowrap gap-4">
                {students.map((student) => {
                  return (
                    <Link href={`/user/${student.id}`} className="hover:text-gray-400">
                    {student.name}
                    </Link>
                  )
                })}
                </div>
              </div>
            </div>
          </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardHeader>
    </Card>
  )
}

export default LabHeader