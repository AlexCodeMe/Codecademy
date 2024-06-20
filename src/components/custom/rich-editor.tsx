'use client'

import dynamic from "next/dynamic"
import { useMemo } from "react"
import "react-quill/dist/quill.snow.css"

type Props = {
    placeholder: string,
    onChange: (value: string) => void
    value?: string
}

export default function RichEditor({ placeholder, onChange, value }: Props) {
    const ReactQuill = useMemo(
        () => dynamic(() => import("react-quill"), { ssr: false }),
        []
    )

    return (
        <ReactQuill
            theme="snow"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    )
}