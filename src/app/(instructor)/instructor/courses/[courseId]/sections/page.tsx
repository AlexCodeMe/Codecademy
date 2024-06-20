import CreateSectionForm from '@/components/sections/create-section-form'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function CourseIdSectionsPage({ params }: {
    params: { courseId: string }
}) {
    const { userId } = auth()
    if (!userId) return redirect('/sign-in')

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            instructorId: userId,
        },
        include: {
            sections: {
                orderBy: {
                    position: "asc",
                },
            },
        },
    })
    if (!course) return redirect('/instructor/courses')

    return <CreateSectionForm course={course} />
}