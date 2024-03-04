'use client'

import React, { useState } from 'react'
import { useHotels } from '@/hooks/useHotel'
import HotelListItem from './HotelListItem'
import Link from 'next/link'
import Pagination from '../Pagination'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function HotelMain() {
  const { user } = useUser()
  const router = useRouter()

  if (user && user.objData.role === null) {
    toast.info('호스트 혹은 게스트 선택 후 이용해주세요🏡🧳')
    router.push('/auth/signup/role')
  } // 역할 설정 안했을 시, 역할 설정 페이지로 이동

  const [page, setPage] = useState(0)
  const { hotels, isLoading, isError, error } = useHotels(page)

  if (isLoading) return <div></div>

  const hotelData = hotels.objData.content

  return (
    <div>
      <div className='w-full text-center px-5 py-10 max-[280px]:px-0 max-[280px]:pt-0'>
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 py-4 sm:gap-3 lg:gap-4 lg:px-4 mb-24 w-full'>
          {hotelData.map((hotel) => (
            <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
              <HotelListItem hotel={hotel} />
            </Link>
          ))}
        </ul>
      </div>
      <div className='flex justify-center'>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={hotels.objData.totalPages}
        />
      </div>
    </div>
  )
}
