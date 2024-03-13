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
import React, { useState, useEffect } from 'react'
import { format, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { fetchHostsHotelReservationDetail } from '@/hooks/useReservation'
import Pagination from '../Pagination'
import { FaCheck } from 'react-icons/fa'

export default function HotelSales({ id }) {
  const { hotel, isHotelLoading, isFetching, isError, error } =
    useHotelDetail(id)

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [metaData, setMetaData] = useState(0)

  const [reservations, setReservations] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())

  // 오늘 날짜를 'YYYY-MM-DD' 형식의 문자열로 구합니다.
  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    getReservationsByYearAndMonth(currentDate)
  }, [page]) // 페이지 또는 날짜가 변경될 때마다 실행됩니다.

  useEffect(() => {
    setPage(0)
  }, [currentDate]) // 날짜가 변경될 때마다 페이지를 0으로 초기화합니다.

  const getReservationsByYearAndMonth = async (date) => {
    const year = format(date, 'yyyy', { locale: ko })
    const month = format(date, 'M', { locale: ko })

    setCurrentDate(date)

    const hostReservations = await fetchHostsHotelReservationDetail(
      page,
      year,
      month,
      id
    )
      .then((res) => {
        const data = res.objData
        console.log(res)
        setReservations(data.reservations.content)
        setTotalPages(data.reservations.totalPages)
        setMetaData(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  if (isHotelLoading) return <div></div>

  return (
    <div className='mt-32 min-h-[60vh] text-center'>
      <div className='grid grid-cols-5'>
        <Card className='h-[40rem] col-span-1 py-4 bg-gray-100'>
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
        <div className='ml-10 col-span-3'>
          <div className='flex space-x-4'>
            <button
              className='bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'
              onClick={() => getReservationsByYearAndMonth(new Date())}>
              {format(new Date(), 'yyyy년 MM월', { locale: ko })}
            </button>
            <button
              className='bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'
              onClick={() =>
                getReservationsByYearAndMonth(subMonths(new Date(), 1))
              }>
              {format(subMonths(new Date(), 1), 'yyyy년 MM월', { locale: ko })}
            </button>
            <button
              className='bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'
              onClick={() =>
                getReservationsByYearAndMonth(subMonths(new Date(), 2))
              }>
              {format(subMonths(new Date(), 2), 'yyyy년 MM월', { locale: ko })}
            </button>
          </div>
          <div>
            <div className='overflow-x-auto relative shadow-md sm:rounded-lg'>
              <table className='mt-6 w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                  <tr>
                    <th scope='col' className='py-3 px-6'>
                      예약 ID
                    </th>
                    <th scope='col' className='py-3 px-6'>
                      체크인 날짜
                    </th>
                    <th scope='col' className='py-3 px-6'>
                      체크아웃 날짜
                    </th>
                    <th scope='col' className='py-3 px-6'>
                      이름
                    </th>
                    <th scope='col' className='py-3 px-6'>
                      가격
                    </th>
                    <th scope='col' className='py-3 px-6'>
                      이용 완료
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation, index) => (
                    <tr className='bg-white border-b' key={index}>
                      <td className='py-4 px-6'>{reservation.id}</td>
                      <td className='py-4 px-6'>{reservation.checkInDate}</td>
                      <td className='py-4 px-6'>{reservation.checkOutDate}</td>
                      <td className='py-4 px-6'>{reservation.buyerName}</td>
                      <td className='py-4 px-6'>{reservation.paidPrice}</td>

                      <td className='py-4 px-6'>
                        {' '}
                        {reservation.checkOutDate < todayStr && <FaCheck />}
                      </td>
                      {/* 필요한 다른 데이터 셀 추가 */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='flex justify-center mt-16'>
              <Pagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col space-y-10 mt-16'>
          <Card className='ml-3 col-span-1 h-40 bg-gray-100'>
            <CardBody>
              <p>
                총 이용 완료 예약 건수 : {metaData.completedReservationCount} 건
              </p>
            </CardBody>
          </Card>
          <Card className='ml-3 col-span-1 h-40 bg-gray-100'>
            <CardBody>
              <p>총 매출 : {metaData.totalSales}원</p>
            </CardBody>
          </Card>
          <Card className='ml-3 col-span-1 h-40 bg-gray-100'>
            <CardBody>
              <p>
                순 이익 :{' '}
                {metaData.totalSales
                  ? Math.floor(metaData.totalSales * 0.9)
                  : 0}
                원
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
