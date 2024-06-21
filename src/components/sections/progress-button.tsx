'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

type Props = {
    courseId: string
    sectionId: string
    isCompleted: boolean
}

export default function ProgressButton({
    courseId,
    sectionId,
    isCompleted,
}: Props) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function onClick() {
        try {
            setIsLoading(true)
            axios.post(`/api/courses/${courseId}/sections/${sectionId}/progress`, {
                isCompleted: !isCompleted,
            })
            toast.success("Progress updated!")
            router.refresh()
        } catch (err) {
            console.log("Failed to update progress", err)
            toast.error("Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button variant={isCompleted ? "complete" : "default"}
            onClick={onClick}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isCompleted ? (
                <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Completed</span>
                </div>
            ) : (
                "Mark as complete"
            )}
        </Button>
    )
}