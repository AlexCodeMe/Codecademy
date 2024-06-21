import CourseSideBar from '@/components/layout/course-side-bar';
import Topbar from '@/components/layout/topbar';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    children: React.ReactNode;
    params: { courseId: string }
}

export default async function CourseLayout({ children, params }: Props) {
    const { userId } = auth()
    if (!userId) return redirect('/sign-in')

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            sections: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
    })
    if (!course) return redirect('/')

    return (
        <div className="h-full flex flex-col">
            <Topbar />
            <div className="flex-1 flex">
                <CourseSideBar course={course} studentId={userId} />
                <div className="flex-1">{children}</div>
            </div>
        </div>
    )
}