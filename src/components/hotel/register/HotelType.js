'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@nextui-org/react'
import { FaArrowRight } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useRecoilState } from 'recoil'
import { hotelTypeState } from '@/store/hotelState'
import { getIconForType } from '@/constants/hotel'
import { hotelTypes } from '@/constants/constants'
import { toast } from 'react-toastify'
import { useUser } from '@/hooks/useUser'

export default function HotelType() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('')
  const [hotelType, setHotelType] = useRecoilState(hotelTypeState) // Recoil 상태 사용
  const [isVisible, setIsVisible] = useState(false)

  const { user } = useUser()

  if (user && user.objData.role === null) {
    toast.info('호스트 혹은 게스트 선택 후 이용해주세요🏡🧳')
    router.push('/auth/signup/role')
  } // 역할 설정 안했을 시, 역할 설정 페이지로 이동

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSelectType = (type) => {
    setHotelType(type)
    setSelectedType(type)
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (!selectedType) {
      toast.error('숙소 유형을 선택해주세요.')
      return
    }
    router.push('/hotel/register/location')
  }

  const isTypeSelected = (type) => selectedType === type

  return (
    <div
      className={`flex flex-col justify-center items-center transition-all duration-1000 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`}>
      <div className='mt-32 h-[60vh] flex flex-col'>
        <div className='flex justify-center mb-5'>
          <p>숙소의 유형을 선택해주세요.</p>
        </div>
        <div>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-6'>
            {hotelTypes.map((type, index) => (
              <Button
                key={index}
                className={`bg-amber-500 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded ${
                  isTypeSelected(type) ? 'bg-amber-400 border-white' : ''
                }`}
                startContent={getIconForType(type)}
                onClick={() => handleSelectType(type)}>
                {type}
              </Button>
            ))}
            <div className='flex justify-center mt-20'>
              <Button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                onClick={handleNext} // 다음 단계로 넘어가는 함수
              >
                <span className='mr-2'>다음</span>
                <FaArrowRight />{' '}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
