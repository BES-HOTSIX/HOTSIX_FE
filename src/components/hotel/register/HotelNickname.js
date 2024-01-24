'use client'

import React, { useState, useEffect } from 'react'
import { Input, Textarea, Button } from '@nextui-org/react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useRecoilState } from 'recoil'
import { hotelNameState, hotelDescriptionState } from '@/util/hotelState'
import { toast } from 'react-toastify'

export default function HotelNickname() {
  const [nickname, setNickname] = useRecoilState(hotelNameState)
  const [description, setDescription] = useRecoilState(hotelDescriptionState)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleNext = (e) => {
    e.preventDefault()

    if (!nickname) {
      toast.error('숙소 이름을 입력해주세요.')
      return
    }

    if (!description) {
      toast.error('숙소 설명을 입력해주세요.')
      return
    }

    router.push('/hotel/register/price')
  }

  const handlePrevious = (e) => {
    e.preventDefault()
    router.push('/hotel/register/amenities')
  }

  return (
    <div>
      <div
        className={`flex flex-col space-y-6 items-center transition-all duration-1000 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}>
        <p>숙소의 이름과 설명을 입력해주세요.</p>
        <Input
          style={{ height: '2rem' }}
          className='w-72'
          placeholder='숙소 이름'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <Textarea
          style={{ height: '20rem' }}
          className='w-72'
          placeholder='숙소 설명'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
