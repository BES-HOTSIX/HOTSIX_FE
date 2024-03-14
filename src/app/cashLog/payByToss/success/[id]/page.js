import PaySuccess from '@/components/cashLog/tossPayments/PaySuccess'
import React from 'react'

export default function page({ searchParams, params: { id, discountAmount } }) {
  console.log(searchParams)

  return (
    <PaySuccess
      discountAmount={searchParams.discountAmount}
      payment={searchParams}
      reserveId={id}
    />
  )
}
