'use client'

import React, { useState } from 'react'
import { useSearchHotels } from '@/hooks/useHotel'
import HotelListItem from '../HotelListItem'
import Pagination from '@/components/Pagination'
import Link from 'next/link'

export default function SearchPage({ city, startDate, endDate }) {
  const [page, setPage] = useState(0)
  console.log(city, startDate, endDate)

  const { hotels, isLoading } = useSearchHotels(page, city, startDate, endDate)

  if (isLoading) {
    return <div></div>
  }

  console.log(hotels)

  return (
    <div>
      <div className='w-full text-center px-5 py-10 max-[280px]:px-0 max-[280px]:pt-0'>
        <p className='p-5 text-start'>
          총 {hotels?.objData?.totalElements}개의 숙소가 검색되었습니다.
        </p>
        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 py-4 sm:gap-3 lg:gap-4 lg:px-4 mb-24 w-full'>
          {hotels?.objData.content?.map((hotel, index) => (
            <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
              <HotelListItem key={hotel.id} hotel={hotel} />
            </Link>
          ))}
        </ul>
      </div>
      <div className='flex justify-center my-4'>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={hotels?.objData?.totalPages}
        />
      </div>
    </div>
  )
}
