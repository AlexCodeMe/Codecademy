import { zodResolver } from '@hookform/resolvers/zod'
import { Resource, Section } from '@prisma/client'
import axios from 'axios'
import { File, Loader2, PlusCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import FileUpload from '../custom/file-upload'
import { Button } from '../ui/button'

type Props = {
    section: Section & { resources: Resource[] }
    courseId: string
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Name is required and must be at least 2 characters long',
    }),
    fileUrl: z.string().min(1, {
        message: 'File is required',
    }),
})

export default function ResourceForm({ section, courseId }: Props) {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            fileUrl: '',
        },
    })

    const { isValid, isSubmitting } = form.formState

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await axios.post(
                `/api/courses/${courseId}/sections/${section.id}/resources`,
                values
            )
            toast.success('New Resource uploaded!')
            form.reset()
            router.refresh()
        } catch (err) {
            toast.error('Something went wrong!')
            console.log('Failed to upload resource', err)
        }
    }

    async function onDelete(id: string) {
        try {
            await axios.post(
                `/api/courses/${courseId}/sections/${section.id}/resources/${id}`
            )
            toast.success('Resource deleted!')
            router.refresh()
        } catch (err) {
            toast.error('Something went wrong!')
            console.log('Failed to delete resource', err)
        }
    }

    return (
        <>
            <div className='flex gap-2 items-center text-xl font-bold mt-12'>
                <PlusCircle />
                Add Resources (optional)
            </div>

            <p className='text-sm font-medium mt-2'>
                Add resources to this section to help students learn better.
            </p>

            <div className='mt-5 flex flex-col gap-5'>
                {section.resources.map((resource) => (
                    <div key={resource.id}
                        className='flex justify-between bg-[#FFF8EB] rounded-lg text-sm font-medium p-3'
                    >
                        <div className='flex items-center'>
                            <File className='h-4 w-4 mr-4' />
                            {resource.name}
                        </div>
                        <button
                            className='text-[#FDAB04]'
                            disabled={isSubmitting}
                            onClick={() => onDelete(resource.id)}
                        >
                            {isSubmitting ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                <X className='h-4 w-4' />
                            )}
                        </button>
                    </div>
                ))}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8 my-5'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>File Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Ex: Textbook' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='fileUrl'
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>Upload File</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            value={field.value || ''}
                                            onChange={(url) => field.onChange(url)}
                                            endpoint='sectionResource'
                                            page='Edit Section'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' disabled={!isValid || isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                'Upload'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )
}