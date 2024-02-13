'use client'

import { useHotelDetail } from '@/hooks/useHotel'
import React from 'react'
import Image from 'next/image'

export default function HotelAllPictures({ id }) {
  console.log(id)

  const { hotel, isHotelLoading, isFetching, isError, error } =
    useHotelDetail(id)

  if (isHotelLoading) return <div></div>

  const hotelImages = hotel.imagesResponse.imageUrl

  console.log(hotelImages)

  return (
    <div className='mt-32 min-h-screen'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {hotelImages.map((imageUrl, index) => (
          <div key={index} className='relative w-full h-96'>
            {/* 이미지를 렌더링합니다. layout='fill'로 설정하여 div 크기에 맞게 이미지를 채웁니다. */}
            <Image
              src={imageUrl}
              alt={`Hotel Image ${index + 1}`}
              layout='fill'
              objectFit='cover'
              className='rounded-md'
            />
          </div>
        ))}
      </div>
    </div>
  )
}
