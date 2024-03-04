'use client'

import React from 'react'
import Image from 'next/image'
import newCustomerCoupon from '@/../../public/img/new_customer.jpg'
import Link from 'next/link'

export default function Coupons() {
  return (
    <div className='swiper-container h-auto w-[80vw] mx-auto mt-16 relative'>
      <h1 className='text-xl font-bold'># 이벤트</h1>
      <div className='flex mt-7'>
        <Link href='/coupon/new'>
          <Image
            src={newCustomerCoupon}
            alt='신규 회원가입'
            width={400}
            height={150}
          />
        </Link>
      </div>
    </div>
  )
}
