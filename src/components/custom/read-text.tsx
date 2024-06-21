'use client'

import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'
import "react-quill/dist/quill.bubble.css"

export default function ReadText({ value }: { value: string }) {
    const ReactQuill = useMemo(
        () => dynamic(() => import("react-quill"), { ssr: false }),
        []
    )

    return <ReactQuill
        theme="bubble"
        value={value}
        readOnly
    />
}
