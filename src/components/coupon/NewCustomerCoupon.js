import React from 'react'
import Image from 'next/image'
import ForNewCustomer from '@/../public/img/new_customer_coupon.jpg'

export default function NewCustomerCoupon() {
  return (
    <div className='flex items-center justify-center'>
      <div className='relative mt-11 min-h-[55vh] text-center'>
        <Image
          src={ForNewCustomer}
          width={500}
          height={500}
          alt='new-customer-coupon'
        />
        <button className='absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'>
          발급받기
        </button>
      </div>
    </div>
  )
}
