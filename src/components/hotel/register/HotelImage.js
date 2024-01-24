'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@nextui-org/react'
import { FiXCircle } from 'react-icons/fi'
import { useDropzone } from 'react-dropzone'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { useRegisterHotel } from '@/hooks/useHotel'
import {
  hotelTypeState,
  hotelAddressState,
  hotelDetailAddressState,
  numberOfBedroomsState,
  numberOfBedsState,
  numberOfBathroomsState,
  maximumGuestsState,
  hotelAmenitiesState,
  hotelNameState,
  hotelDescriptionState,
  hotelPricePerNightState,
  hotelImagesState,
} from '@/util/hotelState'
import { toast } from 'react-toastify'

export default function HotelImage() {
  const [images, setImages] = useRecoilState(hotelImagesState)
  const [hotelType] = useRecoilState(hotelTypeState)
  const [address] = useRecoilState(hotelAddressState)
  const [addressDetail] = useRecoilState(hotelDetailAddressState)
  const [roomCnt] = useRecoilState(numberOfBedroomsState)
  const [bedCnt] = useRecoilState(numberOfBedsState)
  const [bathroomCnt] = useRecoilState(numberOfBathroomsState)
  const [maxPeople] = useRecoilState(maximumGuestsState)
  const [facility] = useRecoilState(hotelAmenitiesState)
  const [nickname] = useRecoilState(hotelNameState)
  const [description] = useRecoilState(hotelDescriptionState)
  const [price] = useRecoilState(hotelPricePerNightState)

  const resetHotelImages = useResetRecoilState(hotelImagesState)
  const resetHotelType = useResetRecoilState(hotelTypeState)
  const resetHotelAddress = useResetRecoilState(hotelAddressState)
  const resetHotelDetailAddress = useResetRecoilState(hotelDetailAddressState)
  const resetNumberOfBedrooms = useResetRecoilState(numberOfBedroomsState)
  const resetNumberOfBeds = useResetRecoilState(numberOfBedsState)
  const resetNumberOfBathrooms = useResetRecoilState(numberOfBathroomsState)
  const resetMaximumGuests = useResetRecoilState(maximumGuestsState)
  const resetHotelAmenities = useResetRecoilState(hotelAmenitiesState)
  const resetHotelName = useResetRecoilState(hotelNameState)
  const resetHotelDescription = useResetRecoilState(hotelDescriptionState)
  const resetHotelPricePerNight = useResetRecoilState(hotelPricePerNightState)

  const { submitRegister, isPending, isError, error } = useRegisterHotel()

  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const resetData = () => {
    resetHotelImages()
    resetHotelType()
    resetHotelAddress()
    resetHotelDetailAddress()
    resetNumberOfBedrooms()
    resetNumberOfBeds()
    resetNumberOfBathrooms()
    resetMaximumGuests()
    resetHotelAmenities()
    resetHotelName()
    resetHotelDescription()
    resetHotelPricePerNight()
    sessionStorage.removeItem('sessionStorage')
  }

  const handleComplete = (e) => {
    e.preventDefault()

    if (images.length < 5) {
      toast.error('숙소 사진을 5장 이상 등록해주세요.')
      return
    }

    const formData = new FormData()

    const hotelInfo = {
      hotelType: hotelType,
      address: address,
      addressDetail: addressDetail,
      roomCnt: roomCnt,
      bedCnt: bedCnt,
      bathroomCnt: bathroomCnt,
      maxPeople: maxPeople,
      facility: facility,
      nickname: nickname,
      description: description,
      price: price,
    }

    formData.append(
      'hotelInfo',
      new Blob([JSON.stringify(hotelInfo)], { type: 'application/json' })
    )

    // 이미지 파일 추가
    images.forEach((image, index) => {
      console.log(image)
      formData.append('files', image)
    })

    submitRegister(formData)

    resetData()

    router.push('/hotel')
  }

  const handlePrevious = () => {
    router.push('/hotel/register/price')
  }

  const onDrop = useCallback((acceptedFiles) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  return (
    <div
      className={`container mx-auto p-4 space-y-8 transition-all duration-1000 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`}>
      <p className='flex justify-center mb-5'>
        숙소의 사진을 첨부해주세요. (최소 5장)
      </p>
      <div
        {...getRootProps()}
        className='border-dashed border-4 border-gray-200 p-4 text-center cursor-pointer'>
        <input {...getInputProps()} />
        <p>여기에 사진을 드래그 앤 드랍하거나 클릭하여 선택하세요</p>
      </div>
      <div className='flex flex-wrap mt-4'>
        {images.map((file, index) => (
          <div key={index} className='w-1/5 p-1 border'>
            <div className='relative'>
              <img
                src={URL.createObjectURL(file)}
                alt={`미리보기 ${index}`}
                className='w-full h-auto'
              />
              <Button
                auto
                flat
                color='error'
                className='absolute top-0 right-0'
                onClick={() => removeImage(index)}>
                <FiXCircle />
              </Button>
            </div>
          </div>
        ))}
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
          onClick={handleComplete} // 다음 단계로 넘어가는 함수
        >
          <span>등록 완료</span>
          <FaArrowRight />{' '}
        </Button>
      </div>
    </div>
  )
}
