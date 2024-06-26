'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Course, MuxData, Progress, Purchase, Resource, Section } from '@prisma/client'
import axios from 'axios'
import toast from 'react-hot-toast'
import { File, Loader2, Lock } from 'lucide-react'
import ReadText from '../custom/read-text'
import MuxPlayer from '@mux/mux-player-react'
import Link from 'next/link'
import ProgressButton from './progress-button'
import SectionMenu from '../layout/section-menu'

type Props = {
    course: Course & { sections: Section[] }
    section: Section
    purchase: Purchase | null
    muxData: MuxData | null
    resources: Resource[] | []
    progress: Progress | null
}

export default function SectionsDetails({ course, section, purchase, muxData, resources, progress }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const isLocked = !purchase && !section.isFree

    async function buyCourse() {
        try {
            setIsLoading(true)
            const response = await axios.post(`/api/courses/${course.id}/checkout`)
            window.location.assign(response.data.url)
        } catch (err) {
            console.log("Failed to chechout course", err)
            toast.error("Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className='px-6 py-4 flex flex-col gap-5'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
                <h1 className='text-2xl font-bold max-md:mb-4'>{section.title}</h1>
                <div className='flex gap-4'>
                    <SectionMenu course={course} />
                    {!purchase ? (
                        <Button onClick={buyCourse}>
                            {isLoading ? <Loader2 className='size-4 animate-spin' /> : <p>Buy this Course</p>}
                        </Button>
                    ) : (
                        <ProgressButton courseId={course.id}
                            sectionId={section.id}
                            isCompleted={!!progress?.isCompleted}
                        />
                    )}
                </div>
            </div>

            <ReadText value={section.description!} />

            {isLocked ? (
                <div className="px-10 flex flex-col gap-5 items-center bg-[#FFF8EB]">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm font-bold">
                        Video for this section is locked! Please buy the course to access.
                    </p>
                </div>
            ) : (
                <MuxPlayer
                    playbackId={muxData?.playbackId || ""}
                    className="md:max-w-[600px]"
                />
            )}

            <div>
                <h2 className="text-xl font-bold mb-5">Resources</h2>
                {resources.map((resource) => (
                    <Link key={resource.id}
                        href={resource.fileUrl}
                        target="_blank"
                        className="flex items-center bg-[#FFF8EB] rounded-lg text-sm font-medium p-3"
                    >
                        <File className="h-4 w-4 mr-4" />
                        {resource.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}
