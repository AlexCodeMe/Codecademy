'use client'

import { Category } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

type Props = {
    categories: Category[]
    selectedCategory: string | null
}

export default function Categories({ categories, selectedCategory }: Props) {
    const router = useRouter()

    const onClick = (categoryId: string | null) => {
        router.push(categoryId ? `/categories/${categoryId}` : "/")
    }

    return (
        <div className="flex flex-wrap px-4 gap-7 justify-center my-10">
            <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => onClick(null)}
            >
                All Categories
            </Button>
            {categories.map((category) => (
                <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => onClick(category.id)}
                >
                    {category.name}
                </Button>
            ))}
        </div>
    )
}