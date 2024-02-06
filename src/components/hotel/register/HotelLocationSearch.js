'use client'

import React, { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { useRecoilState } from 'recoil'
import { hotelAddressState } from '@/store/hotelState'
import { toast } from 'react-toastify'

export default function HotelLocationSearch() {
  const router = useRouter()
  const [hotelAddress, setHotelAddress] = useRecoilState(hotelAddressState) // Recoil 상태 사용
  const postcodeContainer = useRef(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    const scriptId = 'daum-postcode-script'
    let script = document.getElementById(scriptId)

    const loadScript = () => {
      script = document.createElement('script')
      script.id = scriptId
      script.src =
        'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      document.body.appendChild(script)
      script.onload = () => {
        if (isMounted.current) {
          initializePostcode()
        }
      }
    }

    if (!script) {
      loadScript()
    } else {
      initializePostcode()
    }

    return () => {
      isMounted.current = false
    }
  }, [])

  const initializePostcode = () => {
    if (
      window.daum &&
      window.daum.Postcode &&
      postcodeContainer.current &&
      !postcodeContainer.current.hasChildNodes()
    ) {
      new window.daum.Postcode({
        oncomplete: handleAddress,
        width: '1000',
        height: '600',
      }).embed(postcodeContainer.current)
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (!hotelAddress) {
      toast.error('주소를 검색해주세요.')
      return
    }
    router.push('/hotel/register/location/map')
  }

  const handlePrevious = (e) => {
    e.preventDefault()
    router.push('/hotel/register')
  }

  const handleAddress = (data) => {
    let fullAddress = data.address
    let extraAddress = ''
    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }

    setHotelAddress(fullAddress)
    router.push(`/hotel/register/location/map`)
  }

  return (
    <div>
      <div className='mt-32'>
        <div className='flex justify-center items-center'>
          <div className='flex flex-col space-y-4'>
            <p>주소를 검색해주세요.</p>
          </div>
        </div>
        <div ref={postcodeContainer} className='flex justify-center' />
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
