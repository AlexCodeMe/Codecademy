import AlertBanner from '@/components/custom/alert-banner'
import EditSectionForm from '@/components/sections/edit-section-form'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function SectionIdPage({ params }: {
  params: { courseId: string, sectionId: string }
}) {
  const { userId } = auth()

  if (!userId) {
    return redirect('/sign-in')
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: userId,
    },
  })

  if (!course) {
    return redirect('/instructor/courses')
  }

  const section = await db.section.findUnique({
    where: {
      id: params.sectionId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
      resources: true,
    },
  })

  if (!section) {
    return redirect(`/instructor/courses/${params.courseId}/sections`)
  }

  const requiredFields = [section.title, section.description, section.videoUrl]
  const requiredFieldsCount = requiredFields.length
  const missingFields = requiredFields.filter((field) => !Boolean(field)) // Return falsy values: undefined, null, 0, false, NaN, ''
  const missingFieldsCount = missingFields.length
  const isCompleted = requiredFields.every(Boolean)

  return (
    <div className="px-10">
      <AlertBanner
        isCompleted={isCompleted}
        requiredFieldsCount={requiredFieldsCount}
        missingFieldsCount={missingFieldsCount}
      />
      <EditSectionForm
        section={section}
        courseId={params.courseId}
        isCompleted={isCompleted}
      />
    </div>
  )
}
