'use client'

import { z } from "zod"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title is required and must be at least 2 characters long",
    }),
})

import React from 'react'
import { Course, Section } from "@prisma/client"
import { usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Loader2 } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import SectionList from "./section-list"

export default function CreateSectionForm({ course }: {
    course: Course & { sections: Section[] }
}) {
    const pathname = usePathname()
    const router = useRouter()

    const routes = [
        {
            label: "Basic Information",
            path: `/instructor/courses/${course.id}/basic`,
        },
        { label: "Sections", path: `/instructor/courses/${course.id}/sections` },
    ]

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })

    const { isValid, isSubmitting } = form.formState

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await axios.post(
                `/api/courses/${course.id}/sections`,
                values
            )

            router.push(
                `/instructor/courses/${course.id}/sections/${response.data.id}`
            )

            toast.success("New Section created!")
        } catch (err) {
            toast.error("Something went wrong!")
            console.log("[create-section-form] onSubmit", err)
        }
    }

    async function onReorder(updateData: { id: string, position: number }[]) {
        try {
            await axios.put(`/api/courses/${course.id}/sections/reorder`, {
                list: updateData,
            })
            toast.success("Sections reordered successfully")
        } catch (err) {
            console.log("[create-section-form] onReorder", err)
            toast.error("Something went wrong!")
        }
    }

    return (
        <div className='px-10 py-6'>
            <div className="flex gap-5">
                {routes.map((route) => (
                    <Link key={route.path} href={route.path}>
                        <Button variant={pathname === route.path ? "default" : "outline"}>
                            {route.label}
                        </Button>
                    </Link>
                ))}
            </div>

            <SectionList
                items={course.sections || []}
                onReorder={onReorder}
                onEdit={(id) =>
                    router.push(`/instructor/courses/${course.id}/sections/${id}`)
                }
            />

            <h1 className="text-xl font-bold mt-5">Add New Section</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Introduction" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-5">
                        <Link href={`/instructor/courses/${course.id}/basic`}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={!isValid || isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Create"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
