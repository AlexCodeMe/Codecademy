import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatPrice } from '@/lib/utils'

type Props = {
    value: number
  label: string
  shouldFormat?: boolean
}

export default function DataCard({ value, label, shouldFormat }: Props) {
  return (
    <Card>
    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
      <CardTitle className='text-sm font-medium'>{label}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className='text-lg font-bold'>
        {shouldFormat ? formatPrice(value) : value}
      </div>
    </CardContent>
  </Card>
  )
}