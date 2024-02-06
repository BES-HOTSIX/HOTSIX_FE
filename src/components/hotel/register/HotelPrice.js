'use client'

import React, { useState, useEffect } from 'react'
import { Input, Button } from '@nextui-org/react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useRecoilState } from 'recoil'
import { hotelPricePerNightState } from '@/store/hotelState'
import { toast } from 'react-toastify'

export default function HotelPrice() {
  const [price, setPrice] = useState('')
  const [numberPrice, setNumberPrice] = useRecoilState(hotelPricePerNightState)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleChange = (e) => {
    // 숫자만 입력되도록 함
    const value = e.target.value.replace(/[^0-9]/g, '')
    setNumberPrice(Number(value))
    // 숫자에 콤마 추가
    const formattedValue = Number(value).toLocaleString()
    setPrice(formattedValue)
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (!numberPrice) {
      toast.error('숙박비를 입력해주세요.')
      return
    }
    router.push('/hotel/register/image')
  }

  const handlePrevious = (e) => {
    e.preventDefault()
    router.push('/hotel/register/nickname')
  }

  return (
    <div>
      <div
        className={`flex flex-col mt-32 h-[42vh] items-center space-y-8 transition-all duration-1000 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}>
        <p className='flex'>숙소 하루 숙박비를 입력해주세요.</p>
        <div className='flex justify-center text-center'>
          <Input
            className='w-72'
            placeholder='숙박비를 입력하세요 (숫자만)'
            value={price}
            onChange={handleChange}
          />
          <p className='flex flex-col justify-center ml-3'>원</p>
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
