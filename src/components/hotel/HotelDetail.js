'use client'

import React from 'react'
import { useHotelDetail } from '@/hooks/useHotel'
import Image from 'next/image'
import {
  FaBed,
  FaUsers,
  FaHome,
  FaMoneyBill,
  FaInfo,
  FaBroom,
  FaRestroom,
  FaHotel,
  FaCreativeCommonsShare,
  FaKey,
} from 'react-icons/fa'
import {
  MdFamilyRestroom,
  MdLocationOn,
  MdMeetingRoom,
  MdOutlineRoom,
  MdRoom,
  MdRoomService,
  MdWifi,
  MdTv,
  MdKitchen,
  MdLocalParking,
  MdLocalLaundryService,
  MdAcUnit,
  MdFitnessCenter,
  MdPool,
  MdFreeBreakfast,
  MdOutdoorGrill,
  MdDeck,
} from 'react-icons/md'
import { AiFillStar } from 'react-icons/ai'

export default function HotelDetail({ id }) {
  const amenitiesOptions = [
    { type: '와이파이', icon: <MdWifi /> },
    { type: 'TV', icon: <MdTv /> },
    { type: '주방', icon: <MdKitchen /> },
    { type: '건물 내 무료 주차', icon: <MdLocalParking /> },
    { type: '건물 내 유료 주차', icon: <MdLocalParking /> },
    { type: '세탁기', icon: <MdLocalLaundryService /> },
    { type: '에어컨', icon: <MdAcUnit /> },
    { type: '주차장', icon: <MdLocalParking /> },
    { type: '헬스장', icon: <MdFitnessCenter /> },
    { type: '수영장', icon: <MdPool /> },
    { type: '조식 제공', icon: <MdFreeBreakfast /> },
    { type: '바베큐 그릴', icon: <MdOutdoorGrill /> },
    { type: '야외 식사 공간', icon: <MdDeck /> },
  ]
  const { hotel, isLoading, isError, error } = useHotelDetail(id)

  if (isLoading) return <div></div>
  if (isError) return <div>Error: {error.message}</div>

  const hotelDetail = hotel.objData

  console.log(hotelDetail)

  const mainImage = hotelDetail.imagesResponse.imageUrl[0]
  const otherImages = hotelDetail.imagesResponse.imageUrl.slice(1, 5)

  return (
    <div className='w-full mx-auto p-4'>
      <h1 className='text-2xl mb-3 border-b-1 border-gray-700'>
        {hotelDetail.nickname}
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='md:col-span-2 mb-4 relative h-[600px]'>
          {' '}
          {/* Adjust height as needed */}
          {/* 큰 이미지 */}
          <Image
            src={mainImage}
            alt='Main Image'
            layout='fill'
            objectFit='cover'
            className='rounded-md'
          />
        </div>
        <div className='grid grid-cols-2 gap-4 h-[600px]'>
          {' '}
          {/* Adjust height as needed */}
          {/* 작은 이미지들 */}
          {otherImages.map((image, index) => (
            <div key={index} className='relative w-full h-[295px]'>
              {' '}
              {/* Adjust height as needed */}
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                layout='fill'
                objectFit='cover'
                className='rounded-md'
              />
            </div>
          ))}
        </div>
      </div>

      <h2 className='text-xl font-semibold mb-4 mt-5'>기본 정보</h2>
      <div className='border-t-2 border-gray-200 mt-4 pt-4'>
        <div className='flex items-center text-lg mb-2'>
          <MdLocationOn className='text-xl mr-2' />
          <p>
            주소: {hotelDetail.address}, {hotelDetail.addressDetail}
          </p>
        </div>
        <div className='flex items-center text-lg mb-2'>
          <FaHome className='text-xl mr-2' />
          <p>숙소 유형: {hotelDetail.hotelType}</p>
        </div>
        <div className='flex items-center text-lg mb-2'>
          <FaKey className='text-xl mr-2' />
          <p>방 개수: {hotelDetail.roomCnt}</p>
        </div>
        <div className='flex items-center text-lg mb-2'>
          <FaBed className='text-xl mr-2' />
          <p>침대 개수: {hotelDetail.bedCnt}</p>
        </div>
        <div className='flex items-center text-lg mb-2 '>
          <MdFamilyRestroom className='text-xl mr-2' />
          <p>최대 수용 인원: {hotelDetail.maxPeople}</p>
        </div>
        <div className='flex items-center text-lg'>
          <FaMoneyBill className='text-xl mr-2' />
          <p>하루 당 가격: {hotelDetail.price} 원</p>
        </div>

        <h2 className='text-xl font-semibold mb-4 mt-5'>편의 시설</h2>
        <div className='border-t-2 border-gray-200 mt-4 pt-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {amenitiesOptions
              .filter((amenity) => hotelDetail.facility.includes(amenity.type))
              .map((filteredAmenity, index) => (
                <div key={index} className='flex items-center text-lg mb-2'>
                  {filteredAmenity.icon}
                  <span className='ml-2'>{filteredAmenity.type}</span>
                </div>
              ))}
          </div>

          <h2 className='text-xl font-semibold mb-4 mt-5'>소개</h2>

          <div className='border-t-2 border-gray-200 mt-4 pt-4'>
            <div className='flex items-center text-lg mb-2'>
              <p>{hotelDetail.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
