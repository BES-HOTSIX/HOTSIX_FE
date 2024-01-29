'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiXCircle } from 'react-icons/fi'
import { amenitiesOptions } from '@/constants/hotel'
import { getIconForType } from '@/constants/hotel'
import { hotelTypes } from '@/constants/constants'
import { MdRemove, MdAdd, MdDone } from 'react-icons/md'
import { Button } from '@nextui-org/react'
import { useHotelDetail, useModifyHotel } from '@/hooks/useHotel'
import { Input, Textarea } from '@nextui-org/react'
import AddressInput from '@/components/hotel/register/ui/AddressInput'
import { toast } from 'react-toastify'
import { useUser } from '@/hooks/useUser'

export default function HotelModify({ id }) {
  const { hotel, isHotelLoading } = useHotelDetail(id)
  const { user, isLoading } = useUser()
  const [images, setImages] = useState([])
  const [deletedImages, setDeletedImages] = useState([])
  const [newImages, setnewImages] = useState([])
  const [selectedType, setSelectedType] = useState('')
  const [roomDetails, setRoomDetails] = useState({
    hotelType: '',
    address: '',
    addressDetail: '',
    roomCnt: 1,
    bedCnt: 1,
    bathroomCnt: 1,
    maxPeople: 1,
    facility: [],
    nickname: '',
    description: '',
    price: 0,
  })

  const {
    submitModify,
    isPending,
    isError: isModifyError,
    error: modifyError,
  } = useModifyHotel()

  const isFile = (image) => image instanceof File
  const isTypeSelected = (type) => roomDetails.hotelType === type

  // hotel 객체가 변경될 때만 images 상태를 업데이트합니다.
  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.body.appendChild(script)

    if (hotel?.imagesResponse?.imageUrl) {
      setImages(hotel.imagesResponse.imageUrl)
    }
    setRoomDetails({
      hotelType: hotel?.hotelType,
      address: hotel?.address,
      addressDetail: hotel?.addressDetail,
      roomCnt: hotel?.roomCnt,
      bedCnt: hotel?.bedCnt,
      bathroomCnt: hotel?.bathroomCnt,
      maxPeople: hotel?.maxPeople,
      facility: Array.isArray(hotel?.facility) ? hotel.facility : [],
      nickname: hotel?.nickname,
      description: hotel?.description,
      price: hotel?.price,
    })
  }, [hotel])

  const onDrop = useCallback((acceptedFiles) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles])
    setnewImages((prevImages) => [...prevImages, ...acceptedFiles])
  }, [])

  const handleIncrement = (field) => () =>
    setRoomDetails((prevDetails) => ({
      ...prevDetails,
      [field]: prevDetails[field] + 1,
    }))

  const handleDecrement = (field) => () =>
    setRoomDetails((prevDetails) => ({
      ...prevDetails,
      [field]: prevDetails[field] > 1 ? prevDetails[field] - 1 : 1,
    }))

  const handleChange = (e) => {
    const { name, value } = e.target

    // 'price' 필드일 경우에만 숫자 입력 허용
    if (name === 'price') {
      if (/^[0-9\b]*$/.test(value)) {
        setRoomDetails((prevState) => ({
          ...prevState,
          [name]: value,
        }))
      }
    } else {
      // 'price'가 아닌 다른 필드는 기존 방식대로 처리
      setRoomDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const handleAmenityClick = (amenity) => {
    setRoomDetails((prevDetails) => {
      // 현재 편의시설 목록에서 선택된 편의시설이 이미 있는지 확인
      const isAmenitySelected = prevDetails.facility?.includes(amenity.type)

      // 선택된 편의시설이 이미 있다면 제거, 없다면 추가
      const updatedAmenities = isAmenitySelected
        ? prevDetails?.facility.filter((item) => item !== amenity.type)
        : [...prevDetails?.facility, amenity.type]

      // 새로운 편의시설 목록으로 상태 업데이트
      return {
        ...prevDetails,
        facility: updatedAmenities,
      }
    })
  }

  const modifySubmitHandler = (e) => {
    e.preventDefault()

    if (images.length + newImages.length - deletedImages.length < 5) {
      toast.error('숙소 사진은 최소 5장 이상이어야 합니다.')
      return
    }

    if (!roomDetails.address) {
      toast.error('주소를 입력해주세요.')
      return
    }

    if (!roomDetails.addressDetail) {
      toast.error('상세 주소를 입력해주세요.')
      return
    }

    if (!roomDetails.nickname) {
      toast.error('숙소 이름을 입력해주세요.')
      return
    }

    if (!roomDetails.description) {
      toast.error('숙소 설명을 입력해주세요.')
      return
    }

    if (!roomDetails.price) {
      toast.error('숙박비를 입력해주세요.')
      return
    }

    if (!roomDetails.hotelType) {
      toast.error('숙소 유형을 선택해주세요.')
      return
    }

    const formData = new FormData()

    formData.append(
      'hotelInfo',
      new Blob([JSON.stringify(roomDetails)], { type: 'application/json' })
    )

    if (newImages.length > 0) {
      // 이미지 파일 추가
      newImages.forEach((image, index) => {
        console.log(image)
        formData.append('files', image)
      })
    }

    if (deletedImages.length > 0) {
      formData.append('deletedImages', deletedImages)
    }

    submitModify({ hotelId: id, formData })
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const removeImage = (index) => {
    const imageToRemove = images[index]

    setImages((prevImages) => prevImages.filter((_, i) => i !== index))

    // newImages에서도 동일한 이미지를 찾아서 삭제합니다.
    if (isFile(imageToRemove)) {
      setnewImages((prevImages) =>
        prevImages.filter((image) => image !== imageToRemove)
      )
    } else {
      // 이미지가 File 객체가 아니라면, 원래부터 있던 이미지입니다.
      // 이 경우, deletedImages에 추가합니다.
      setDeletedImages((prevDeletedImages) => [
        ...prevDeletedImages,
        imageToRemove,
      ])
    }
  }

  const handleSearchAddress = (e) => {
    e.preventDefault()
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          setRoomDetails({ ...roomDetails, ['address']: data.address })
        },
      }).open()
    } else {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  const handleSelectType = (type) => {
    setRoomDetails((prevDetails) => ({
      ...prevDetails,
      hotelType: type,
    }))
    setSelectedType(type)
  }

  if (isLoading) return <div></div>
  if (isHotelLoading) return <div></div>

  return user?.objData.nickname === hotel.host ? (
    <div>
      <h1 className='text-2xl text-center mb-12 text-stone-400'>
        숙소 정보 수정
      </h1>{' '}
      <p className='flex justify-center text-lg'>
        숙소 사진을 첨부해주세요. (최소 5장)
      </p>
      <div className='border-t-2 border-gray-200 mt-4 pt-4'></div>
      <div
        {...getRootProps()}
        className='border-dashed border-4 border-gray-200 p-4 text-center cursor-pointer'>
        <input {...getInputProps()} />
        <p>여기에 사진을 드래그 앤 드랍하거나 클릭하여 선택하세요</p>
      </div>
      <div className='flex flex-wrap mt-4'>
        {images.map((image, index) => (
          <div key={index} className='w-1/5 p-1 border'>
            <div className='relative'>
              <img
                src={isFile(image) ? URL.createObjectURL(image) : image}
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
      <AddressInput
        address={roomDetails.address}
        addressDetail={roomDetails.addressDetail}
        handleChange={handleChange}
        handleSearchAddress={handleSearchAddress}
      />
      <div className='mt-10'>
        <p className='flex justify-center text-lg'>
          숙소 기본 정보를 수정해주세요.
        </p>
        <div className='border-t-2 border-gray-200 mt-4 pt-4'></div>
        <div className='flex flex-col'>
          <div className='flex justify-center items-center space-x-2 p-3   border-gray-200'>
            <p>침실의 개수:</p>
            <button
              className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300 hover:bg-red-500 text-white'
              onClick={handleDecrement('roomCnt')}>
              <MdRemove />
            </button>
            <p>{roomDetails.roomCnt}</p>
            <button
              className='inline-flex  items-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
              onClick={handleIncrement('roomCnt')}>
              <MdAdd />
            </button>
          </div>
          <div className='flex justify-center items-center space-x-2 p-3    border-gray-200'>
            <p>침대의 개수:</p>
            <button
              className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300 hover:bg-red-500 text-white'
              onClick={handleDecrement('bedCnt')}>
              <MdRemove />
            </button>
            <p>{roomDetails.bedCnt}</p>
            <button
              className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
              onClick={handleIncrement('bedCnt')}>
              <MdAdd />
            </button>
          </div>
          <div className='flex justify-center items-center space-x-2 p-3  border-gray-200'>
            <p>욕실의 개수:</p>
            <button
              className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300 hover:bg-red-500 text-white'
              onClick={handleDecrement('bathroomCnt')}>
              <MdRemove />
            </button>
            <p>{roomDetails.bathroomCnt}</p>
            <button
              className='inline-flexitems-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
              onClick={handleIncrement('bathroomCnt')}>
              <MdAdd />
            </button>
          </div>
          <div className='flex justify-center items-center space-x-2 p-3  '>
            <p>최대 수용가능 인원:</p>
            <button
              className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300  hover:bg-red-500 text-white'
              onClick={handleDecrement('maxPeople')}>
              <MdRemove />
            </button>
            <p>{roomDetails.maxPeople}</p>
            <button
              className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
              onClick={handleIncrement('maxPeople')}>
              <MdAdd />
            </button>
          </div>
        </div>
        <div className='mt-10'>
          <p className='flex justify-center text-lg'>
            숙소 이름과 설명를 수정해주세요.
          </p>
          <div className='border-t-2 border-gray-200 mt-4 pt-4'></div>
          <div className='flex flex-col space-y-6 items-center'>
            <Input
              name='nickname'
              style={{ height: '2rem' }}
              className='w-72'
              placeholder='숙소 이름'
              value={roomDetails.nickname}
              onChange={handleChange}
            />
            <Textarea
              name='description'
              style={{ height: '20rem' }}
              className='w-72'
              placeholder='숙소 설명'
              value={roomDetails.description}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='mt-10'>
          <p className='flex justify-center text-lg'>
            숙소 하루 숙박비를 수정해주세요.
          </p>
          <div className='border-t-2 border-gray-200 mt-4 pt-4'></div>
          <div className='flex justify-center text-center'>
            <Input
              name='price'
              className='w-72'
              placeholder='숙박비를 입력하세요 (숫자만)'
              value={roomDetails.price}
              onChange={handleChange}
            />
            <p className='flex flex-col justify-center ml-3'>원</p>
          </div>
        </div>

        <div className='mt-10'>
          <p className='flex justify-center text-lg'>
            숙소 유형을 수정해주세요.
          </p>
          <div className='border-t-2 border-gray-200 mt-4 pt-4'></div>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-6'>
            {hotelTypes.map((type, index) => (
              <Button
                key={index}
                className={`bg-amber-500 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded ${
                  isTypeSelected(type) ? 'bg-amber-800 border-white' : ''
                }`}
                startContent={getIconForType(type)}
                onClick={() => handleSelectType(type)}>
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className='mt-10'>
        <p className='flex justify-center text-lg'>
          숙소 편의시설을 수정해주세요.
        </p>
        <div className='border-t-2 border-gray-200 mt-4 pt-4'></div>
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-6'>
          {amenitiesOptions.map((amenity) => (
            <Button
              name='hotelAmenities'
              key={amenity.type}
              color={
                roomDetails?.facility?.includes(amenity.type)
                  ? 'primary'
                  : 'default'
              }
              onClick={() => handleAmenityClick(amenity)}>
              {amenity.icon} {amenity.type}{' '}
              {roomDetails?.facility?.includes(amenity.type) && <MdDone />}
            </Button>
          ))}
        </div>
        <div className='flex justify-center mt-5'>
          선택된 편의 시설: {roomDetails?.facility.join(', ')}
        </div>
      </div>
      <div className='w-full flex justify-center items-center mt-5 '>
        <Button onClick={modifySubmitHandler} className='bg-amber-400'>
          수정하기
        </Button>
      </div>
    </div>
  ) : (
    <p>잘못된 접근입니다.</p>
  )
}
