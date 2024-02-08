'use client'

import React from 'react'

import { useHotels } from '@/hooks/useHotel'
import Image from 'next/image'
import Link from 'next/link'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar, Autoplay, Grid } from 'swiper/modules'
import SwiperCore from 'swiper'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

export default function RecentHotels() {
  const { hotels, isLoading, isFetching, isError, error, isPlaceholderData } =
    useHotels(0, 20)

  if (isLoading || isFetching) {
    return <div></div>
  }

  console.log(hotels)

  const { content, totalPages } = hotels.objData

  SwiperCore.use([Navigation, Scrollbar, Autoplay])
  return (
    <div className='swiper-container h-auto w-[80vw] mx-auto mt-16 relative'>
      <h1 className='text-xl font-bold'># 최근 등록된 숙소</h1>
      <Swiper
        slidesPerView={2}
        slidesPerGroup={2}
        grid={{ rows: 2, fill: 'row' }}
        spaceBetween={10}
        navigation={{
          nextEl: '.next-slide-button',
          prevEl: '.prev-slide-button',
        }}
        modules={[Navigation, Grid]}
        breakpoints={{
          780: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            grid: {
              rows: 1,
            },
          },
          1024: {
            slidesPerView: 5,
            slidesPerGroup: 5,
            spaceBetween: 20,
            grid: {
              rows: 1,
            },
          },
        }}>
        {content.map((hotel) => (
          <SwiperSlide key={hotel.id}>
            <div>
              <Link
                href={`/hotel/${hotel.id}`}
                className='flex flex-col  w-full h-full mt-10'>
                <Image
                  src={hotel.imagesResponse.imageUrl[0]}
                  alt={hotel.name}
                  width={1000}
                  height={1000}
                  objectFit='cover'
                  layout='responsive'
                />
                <div className='flex flex-col'>
                  <p className='text-xs text-gray-500 mt-2'>
                    {hotel?.hotelType}
                  </p>
                  {/* nickname과 price를 같은 크기로 설정하고 검정색으로 설정 */}
                  <p className='text-md font-sm text-black '>
                    {hotel?.nickname}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {hotel?.address}, {hotel.addressDetail}
                  </p>
                  <p className='text-md font-sm text-black mt-1'>
                    {hotel?.price} 원
                  </p>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 이전 슬라이드 버튼 */}
      <div className='prev-slide-button absolute left-[-30px] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center bg-white rounded-full p-1 shadow-lg border border-gray-200'>
        <MdChevronLeft size='2em' className='text-gray-600' />
      </div>

      <div className='next-slide-button absolute right-[-30px] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center bg-white rounded-full p-1 shadow-lg border border-gray-200'>
        <MdChevronRight size='2em' className='text-gray-600' />
      </div>
    </div>
  )
}
