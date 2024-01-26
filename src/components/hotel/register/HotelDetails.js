'use client'

import React, { useState, useEffect } from 'react'
import { MdRemove, MdAdd } from 'react-icons/md'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useRecoilState } from 'recoil'
import {
  numberOfBedroomsState,
  numberOfBedsState,
  numberOfBathroomsState,
  maximumGuestsState,
} from '@/store/hotelState'

export default function HotelDetails() {
  const [bedroomCount, setBedroomCount] = useRecoilState(numberOfBedroomsState)
  const [bedCount, setBedCount] = useRecoilState(numberOfBedsState)
  const [bathroomCount, setBathroomCount] = useRecoilState(
    numberOfBathroomsState
  )
  const [maxGuestCount, setMaxGuestCount] = useRecoilState(maximumGuestsState)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log(bedCount)
    setIsVisible(true)
  }, [])

  const handleIncrement = (setter) => () => setter((prev) => prev + 1)
  const handleDecrement = (setter) => () =>
    setter((prev) => (prev > 1 ? prev - 1 : 1))

  const handleNext = () => {
    router.push('/hotel/register/amenities')
  }

  const handlePrevious = () => {
    router.push('/hotel/register/location/map')
  }

  return (
    <div>
      <div
        className={`flex flex-col items-center space-y-8 transition-all duration-1000 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}>
        <p className='flex justify-center'>숙소 기본 정보를 입력해주세요.</p>
        <div className='flex items-center space-x-2 p-3  border-b border-gray-200'>
          <p>침실의 개수:</p>
          <button
            className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300 hover:bg-red-500 text-white'
            onClick={handleDecrement(setBedroomCount)}>
            <MdRemove />
          </button>
          <p>{bedroomCount}</p>
          <button
            className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
            onClick={handleIncrement(setBedroomCount)}>
            <MdAdd />
          </button>
        </div>
        <div className='flex items-center space-x-2 p-3   border-b border-gray-200'>
          <p>침대의 개수:</p>
          <button
            className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300 hover:bg-red-500 text-white'
            onClick={handleDecrement(setBedCount)}>
            <MdRemove />
          </button>
          <p>{bedCount}</p>
          <button
            className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
            onClick={handleIncrement(setBedCount)}>
            <MdAdd />
          </button>
        </div>
        <div className='flex items-center space-x-2 p-3  border-b border-gray-200'>
          <p>욕실의 개수:</p>
          <button
            className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300 hover:bg-red-500 text-white'
            onClick={handleDecrement(setBathroomCount)}>
            <MdRemove />
          </button>
          <p>{bathroomCount}</p>
          <button
            className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
            onClick={handleIncrement(setBathroomCount)}>
            <MdAdd />
          </button>
        </div>
        <div className='flex items-center space-x-2 p-3  border-b '>
          <p>최대 수용가능 인원:</p>
          <button
            className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300  hover:bg-red-500 text-white'
            onClick={handleDecrement(setMaxGuestCount)}>
            <MdRemove />
          </button>
          <p>{maxGuestCount}</p>
          <button
            className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
            onClick={handleIncrement(setMaxGuestCount)}>
            <MdAdd />
          </button>
        </div>
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
