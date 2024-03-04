'use client'

import React from 'react'
import HomeBanner from './HomeBanner'
import RecentHotels from './hotel/RecentHotels'
import HotelOrderByLikes from './hotel/HotelOrderByLikes'
import HotelOrderByReservationCnt from './hotel/HotelOrderByReservationCnt'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Coupons from './coupon/Coupons'

export default function Main() {
  const { user, isLoading, isError, error, refetch } = useUser()
  const router = useRouter()

  if (isLoading) {
    return <div></div>
  }

  if (user && user.objData.role === null) {
    toast.info('호스트 혹은 게스트 선택 후 이용해주세요🏡🧳')
    router.push('/auth/signup/role')
  }

  return (
    <section className='flex flex-col justify-center items-center max-w-[850px] mx-auto my-20 mt-10'>
      <div className='w-screen'>
        <HomeBanner />
      </div>
      <div className='min-h-[30vh]'>
        <Coupons />
        <RecentHotels />
        <HotelOrderByLikes />
        <HotelOrderByReservationCnt />
      </div>
    </section>
  )
}
