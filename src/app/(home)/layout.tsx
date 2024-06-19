import Topbar from '@/components/layout/topbar'
import React, { ReactNode } from 'react'

export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <>
          <Topbar />
          {children}
        </>
      )
}
