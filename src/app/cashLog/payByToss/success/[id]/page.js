import PaySuccess from '@/components/cashLog/tossPayments/PaySuccess'
import React from 'react'

export default function page({ searchParams, params: { id } }) {
  console.log(searchParams)

  return <PaySuccess payment={searchParams} reserveId={id} />
}
