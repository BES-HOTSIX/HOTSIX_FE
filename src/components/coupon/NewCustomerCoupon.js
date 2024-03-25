'use client'

import React from 'react'
import Image from 'next/image'
import ForNewCustomer from '@/../public/img/new_customer_coupon.jpg'
import { useIssueFirstReservationCoupon } from '@/hooks/useCoupon'

export default function NewCustomerCoupon() {
  const { issueCoupon, isPending, isError, error } =
    useIssueFirstReservationCoupon()

  const handleIssueFirstReservationCoupon = (e) => {
    e.preventDefault()
    issueCoupon()
  }

  return (
    <div className='flex items-center justify-center'>
      <div className='relative mt-11 min-h-[55vh] text-center'>
        <Image
          src={ForNewCustomer}
          width={500}
          height={500}
          alt='new-customer-coupon'
        />
        <div className='absolute w-full px-4'>
          <p className='bg-white/80 backdrop-blur-md rounded-lg shadow-md p-4 text-gray-700 font-semibold'>
            최대 3만원까지 할인 가능하며, 발급받은 날로부터 30일 내 사용해야
            합니다.
          </p>
        </div>
        <button
          onClick={handleIssueFirstReservationCoupon}
          className='mt-32 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
          발급받기
        </button>
      </div>
    </div>
  )
}
