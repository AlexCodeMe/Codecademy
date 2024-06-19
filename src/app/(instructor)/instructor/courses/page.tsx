import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function CoursePage() {
    return (
        <div className="px-6 py-4">
            <Link href="/instructor/create-course">
                <Button>Create New Course</Button>
            </Link>

            <div className="mt-5">
                {/* <DataTable columns={columns} data={courses} /> */}
            </div>
        </div>
    )
}
