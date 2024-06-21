'use client'

import axios from 'axios'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
    disabled: boolean
    courseId: string
    sectionId?: string
    isPublished: boolean
    page: string
}

export default function PublishButton({
    disabled,
    courseId,
    sectionId,
    isPublished,
    page,
}: Props) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function onClick() {
        let url = `/api/courses/${courseId}`
        if (page === 'Section') {
            url += `/sections/${sectionId}`
        }

        try {
            setIsLoading(true)
            isPublished
                ? await axios.post(`${url}/unpublish`)
                : await axios.post(`${url}/publish`)

            toast.success(`${page} ${isPublished ? 'unpublished' : 'published'}`)
            router.refresh()
        } catch (err) {
            toast.error('Something went wrong!')
            console.log(
                `Failed to ${isPublished ? 'unpublish' : 'publish'} ${page}`,
                err
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button variant='outline'
            disabled={disabled || isLoading}
            onClick={onClick}
        >
            {isLoading
                ? <Loader2 className='h-4 w-4 animate-spin' />
                : isPublished
                    ? 'Unpublish'
                    : 'Publish'}
        </Button>
    )
}
