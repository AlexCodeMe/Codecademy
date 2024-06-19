'use client'

import { Menu, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { UserButton, useAuth } from '@clerk/nextjs'

export default function Topbar() {
    const router = useRouter()
    const pathname = usePathname()
    const { isSignedIn } = useAuth()

    const topRoutes = [
        { label: "Instructor", path: "/instructor/courses" },
        { label: "Learning", path: "/learning" },
    ]
    const sidebarRoutes = [
        { label: "Courses", path: "/instructor/courses" },
        {
            label: "Performance",
            path: "/instructor/performance",
        },
    ]

    const [searchInput, setSearchInput] = useState("")

    function handleSearch() {
        if (searchInput.trim() !== '') router.push(`/search?query=${searchInput}`)

        setSearchInput('')
    }

    return (
        <div className="flex justify-between items-center p-4">
            <Link href="/">
                <Image src="/logo.png" height={100} width={200} alt="logo" />
            </Link>

            <div className="max-md:hidden w-[400px] rounded-full flex">
                <input
                    className="flex-grow bg-[#FFF8EB] rounded-l-full border-none outline-none text-sm pl-4 py-3"
                    placeholder="Search for courses"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                    className="bg-[#FDAB04] rounded-r-full border-none outline-none cursor-pointer px-4 py-3 hover:bg-[#FDAB04]/80"
                    disabled={searchInput.trim() === ""}
                    onClick={handleSearch}
                >
                    <Search className="h-4 w-4" />
                </button>
            </div>

            <div className="flex gap-6 items-center">
                <div className="max-sm:hidden flex gap-6">
                    {topRoutes.map((route) => (
                        <Link
                            href={route.path}
                            key={route.path}
                            className="text-sm font-medium hover:text-[#FDAB04]"
                        >
                            {route.label}
                        </Link>
                    ))}
                </div>

                <div className="z-20 sm:hidden">
                    <Sheet>
                        <SheetTrigger>
                            <Menu className="w-5 h-5" />
                        </SheetTrigger>
                        <SheetContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                {topRoutes.map((route) => (
                                    <Link
                                        href={route.path}
                                        key={route.path}
                                        className="text-sm font-medium hover:text-[#FDAB04]"
                                    >
                                        {route.label}
                                    </Link>
                                ))}
                            </div>

                            {pathname.startsWith("/instructor") && (
                                <div className="flex flex-col gap-4">
                                    {sidebarRoutes.map((route) => (
                                        <Link
                                            href={route.path}
                                            key={route.path}
                                            className="text-sm font-medium hover:text-[#FDAB04]"
                                        >
                                            {route.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>

                {isSignedIn ? (
                    <UserButton afterSignOutUrl="/sign-in" />
                ) : (
                    <Link href="/sign-in">
                        <Button>Sign In</Button>
                    </Link>
                )}
            </div>
        </div>
    )
}
