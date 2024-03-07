'use client'

import { useHotelDetail } from '@/hooks/useHotel'
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Divider,
} from '@nextui-org/react'
import React from 'react'

export default function HotelSales({ id }) {
  const { hotel, isHotelLoading, isFetching, isError, error } =
    useHotelDetail(id)

  if (isHotelLoading) return <div></div>

  console.log(hotel)

  return (
    <div className='mt-32 min-h-[60vh] text-center'>
      <div className='grid grid-cols-4'>
        <Card className='col-span-1 py-4 bg-gray-100'>
          <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
            <p className='text-tiny uppercase font-bold'>{hotel?.address}</p>
            <small className='text-default-500'>{hotel?.addressDetail}</small>
            <h4 className='font-bold text-large'>{hotel?.nickname}</h4>
          </CardHeader>
          <CardBody className='overflow-visible py-2'>
            <Image
              alt='Card background'
              className='object-cover rounded-xl'
              src={hotel?.imagesResponse.imageUrl[0]}
              width={270}
            />
          </CardBody>
          <Divider />
          <CardFooter>
            <div className='flex flex-col text-start space-y-2'>
              <p>호스트 : {hotel?.host}</p>
              <p>하루 숙박비 : {hotel?.price}원</p>
              <p>숙소 유형 : {hotel?.hotelType}</p>
              <p>방 개수 : {hotel?.roomCnt}</p>
              <p>침대 개수 : {hotel?.bedCnt}</p>
              <p>화장실 개수 : {hotel?.bathroomCnt}</p>
              <p>최대 수용 인원: {hotel?.maxPeople}</p>
              <p>편의 시설 : {hotel.facility.join(', ')}</p>
              <p>소개 : {hotel.description}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
