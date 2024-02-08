'use client'

import React from 'react'

import { useHotelsSortedByReservation } from '@/hooks/useHotel'
import Image from 'next/image'
import Link from 'next/link'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar, Autoplay, Grid } from 'swiper/modules'
import SwiperCore from 'swiper'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { AiFillFire } from 'react-icons/ai'

export default function HotelOrderByReservationCnt() {
  const {
    hotelsSortedByReservation,
    isLoading,
    isFetching,
    isError,
    error,
    isPlaceholderData,
  } = useHotelsSortedByReservation(0, 20)

  if (isLoading || isFetching) {
    return <div></div>
  }

  const { content, totalPages } = hotelsSortedByReservation.objData

  console.log(content)

  SwiperCore.use([Navigation, Scrollbar, Autoplay])

  return (
    <div className='swiper-container h-auto w-[80vw] mx-auto mt-16 relative'>
      <h1 className='text-xl font-bold'># 마감 임박 숙소</h1>
      <Swiper
        slidesPerView={2}
        slidesPerGroup={2}
        grid={{ rows: 2, fill: 'row' }}
        spaceBetween={10}
        navigation={{
          nextEl: '.next-slide-button3',
          prevEl: '.prev-slide-button3',
        }}
        modules={[Navigation, Grid]}
        breakpoints={{
          780: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            grid: {
              rows: 1,
            },
          },
          1024: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 20,
            grid: {
              rows: 1,
            },
          },
        }}>
        {content.map((hotel) => (
          <SwiperSlide key={hotel.id}>
            <div className='flex flex-col'>
              <Link
                href={`/hotel/${hotel.id}`}
                className='flex flex-col justify-center w-full h-full mt-10'>
                {/* 이미지 컨테이너에 relative 클래스 추가 및 높이 설정 */}
                <div className='relative sm:text-lg md:max-w-[76.8rem] h-64'>
                  <Image
                    src={hotel.imagesResponse.imageUrl[0]}
                    alt={hotel.nickname}
                    objectFit='cover'
                    fill
                    className='rounded-md'
                  />
                </div>

                <div className='flex flex-col'>
                  <p className='text-xs text-gray-500 mt-2'>
                    {hotel?.hotelType}
                  </p>
                  <p className='text-md font-sm text-black'>
                    {hotel?.nickname}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {hotel?.address}, {hotel.addressDetail}
                  </p>
                  <p className='text-md font-sm text-black mt-1'>
                    {hotel?.price} 원
                  </p>
                  <div className='flex items-center bg-red-200 w-2/3 text-white p-1 rounded-lg'>
                    <AiFillFire className='mr-1' size='1.5em' />
                    예약 {hotel?.reservationCountResponse.reservationsCount}
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 이전 슬라이드 버튼 */}
      <div className='prev-slide-button3 absolute left-[-30px] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center bg-white rounded-full p-1 shadow-lg border border-gray-200'>
        <MdChevronLeft size='2em' className='text-gray-600' />
      </div>

      <div className='next-slide-button3 absolute right-[-30px] top-1/2 -translate-y-1/2 z-10 flex items-center justify-center bg-white rounded-full p-1 shadow-lg border border-gray-200'>
        <MdChevronRight size='2em' className='text-gray-600' />
      </div>
    </div>
  )
}
