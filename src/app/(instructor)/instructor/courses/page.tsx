import { columns } from '@/components/courses/columns'
import DataTable from '@/components/custom/data-table'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function CoursePage() {
    const { userId } = auth()
    if (!userId) return redirect('/sign-in')

    const courses = await db.course.findMany({
        where: {
            instructorId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="px-6 py-4">
            <Link href="/instructor/create-course">
                <Button>Create New Course</Button>
            </Link>

            <div className="mt-5">
                <DataTable columns={columns} data={courses} />
            </div>
        </div>
    )
}
