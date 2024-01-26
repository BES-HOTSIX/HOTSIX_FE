'use client'

import React from 'react'
import { useRef, useEffect, useState } from 'react'
import { Input, Button } from '@nextui-org/react'
import { MdLocationOn } from 'react-icons/md'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useRecoilState } from 'recoil'
import { hotelDetailAddressState } from '@/store/hotelState'
import { hotelAddressState } from '@/store/hotelState'
import { toast } from 'react-toastify'

export default function HotelLocationMap() {
  const mapRef = useRef(null) // 지도를 표시할 DOM 요소에 대한 참조
  const [map, setMap] = useState(null) // 지도 인스턴스
  const [isVisible, setIsVisible] = useState(false)
  const [detailAddress, setDetailAddress] = useRecoilState(
    hotelDetailAddressState
  )
  const [address, setAddress] = useRecoilState(hotelAddressState)
  const router = useRouter()

  const handleInputChange = (e) => {
    setDetailAddress(e.target.value)
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (!detailAddress) {
      toast.error('상세 주소를 입력해주세요.')
      return
    }
    router.push('/hotel/register/detail')
  }

  const handlePrevious = (e) => {
    e.preventDefault()
    router.push('/hotel/register/location')
  }

  useEffect(() => {
    setIsVisible(true)
    // 네이버 지도 API 스크립트가 이미 로드되었는지 확인
    if (!map && window.naver && window.naver.maps) {
      initMap()
    } else if (!map) {
      // 스크립트가 아직 로드되지 않았다면 로드를 기다림
      const checkIfNaverMapsIsLoaded = setInterval(() => {
        if (window.naver && window.naver.maps) {
          clearInterval(checkIfNaverMapsIsLoaded)
          initMap()
        }
      }, 100)
    }
    if (address && map) {
      naver.maps.Service.geocode(
        {
          query: address,
        },
        function (status, response) {
          if (status !== naver.maps.Service.Status.OK) {
            return alert('주소를 찾을 수 없습니다.')
          }

          const result = response.v2.addresses[0]
          const coords = new naver.maps.LatLng(result?.y, result?.x)

          // 지도 중심 이동
          map.setCenter(coords)

          // 지도 확대
          map.setZoom(15)

          // 마커 생성 (선택적)
          new naver.maps.Marker({
            position: coords,
            map: map,
          })
        }
      )
    }
  }, [address, map])

  // 지도 초기화 함수
  function initMap() {
    // 지도를 생성할 때 필요한 옵션 설정
    const mapOptions = {
      center: new naver.maps.LatLng(37.3595704, 127.105399), // 지도의 초기 중심 좌표
      zoom: 10, // 지도의 초기 확대 레벨
    }

    // 지도 생성
    const createdMap = new naver.maps.Map(mapRef.current, mapOptions)

    // 지도 상태 업데이트
    setMap(createdMap)
  }

  return (
    <div
      className={`flex flex-col justify-center space-y-5 transition-all duration-1000 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`}>
      <p className='flex justify-center'>숙소 위치를 확인해주세요.</p>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
      <div className='flex flex-col items-center space-y-3'>
        <div className='flex items-center space-x-2'>
          <MdLocationOn className='text-2xl text-indigo-600' />
          <p className='text-lg'>주소 : {address}</p>
        </div>
        <Input
          className='mt-2 w-1/2'
          placeholder='상세 주소를 입력하세요'
          color='primary'
          value={detailAddress}
          onChange={handleInputChange}
        />
      </div>
      <div className='flex justify-between mt-20'>
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
