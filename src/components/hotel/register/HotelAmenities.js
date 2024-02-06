'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/react'
import {
  MdDone,
  MdWifi,
  MdTv,
  MdKitchen,
  MdLocalParking,
  MdFitnessCenter,
  MdPool,
  MdFreeBreakfast,
  MdOutdoorGrill,
  MdDeck,
  MdLocalLaundryService,
  MdAcUnit,
} from 'react-icons/md'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useRecoilState } from 'recoil'
import { hotelAmenitiesState } from '@/store/hotelState'

export default function HotelAmenities() {
  const [amenities, setAmenities] = useRecoilState(hotelAmenitiesState)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const amenitiesOptions = [
    { type: 'WiFi', icon: <MdWifi /> },
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

  const handleClick = (amenity) => {
    if (amenities.includes(amenity.type)) {
      setAmenities((prev) => prev.filter((item) => item !== amenity.type))
    } else {
      setAmenities((prev) => [...prev, amenity.type])
    }
  }

  const handleNext = () => {
    router.push('/hotel/register/nickname')
  }

  const handlePrevious = () => {
    router.push('/hotel/register/detail')
  }

  return (
    <div>
      <div
        className={`flex flex-col mt-32 h-[42vh] space-y-6 justify-center items-center transition-all duration-1000 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}>
        <p>숙소의 편의 시설을 선택해주세요.</p>
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-6'>
          {amenitiesOptions.map((amenity) => (
            <Button
              key={amenity.type}
              color={amenities.includes(amenity.type) ? 'primary' : 'default'}
              onClick={() => handleClick(amenity)}>
              {amenity.icon} {amenity.type}{' '}
              {amenities.includes(amenity.type) && <MdDone />}
            </Button>
          ))}
        </div>
        <div>선택된 편의 시설: {amenities.join(', ')}</div>
      </div>
      <div className='flex justify-around mt-20'>
        <Button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5'
          onClick={handlePrevious} // 다음 단계로 넘어가는 함수
        >
          <span>이전</span>
          <FaArrowLeft />{' '}
        </Button>

        <Button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-5'
          onClick={handleNext} // 다음 단계로 넘어가는 함수
        >
          <span>다음</span>
          <FaArrowRight />{' '}
        </Button>
      </div>
    </div>
  )
}
