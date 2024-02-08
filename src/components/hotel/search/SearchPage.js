'use client'

import React, { useState } from 'react'
import { useSearchHotels } from '@/hooks/useHotel'
import HotelListItem from '../HotelListItem'
import Pagination from '@/components/Pagination'
import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'
import SearchSideBar from './SearchSideBar'

export default function SearchPage({ city, startDate, endDate }) {
  const [page, setPage] = useState(0)
  const [kw, setKw] = useState('')

  const [isOpen, setIsOpen] = useState(false)
  const [bedroomCount, setBedroomCount] = useState(1)
  const [bedCount, setBedCount] = useState(1)
  const [bathroomCount, setBathroomCount] = useState(1)
  const [maxGuestCount, setMaxGuestCount] = useState(1)
  const [price, setPrice] = useState('')

  const toggleSidebar = () => setIsOpen(!isOpen)

  const {
    hotels,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isPlaceholderData,
  } = useSearchHotels(
    page,
    city,
    startDate,
    endDate,
    kw,
    bedroomCount,
    bedCount,
    bathroomCount,
    maxGuestCount,
    price
  )

  console.log(hotels)

  if (isLoading) {
    return <div></div>
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log(kw, bedroomCount, bedCount, bathroomCount, maxGuestCount, price)
    refetch()
  }

  return (
    <div>
      <div className='w-full h-[60vh] text-center px-5 py-10 max-[280px]:px-0 max-[280px]:pt-0'>
        <SearchSideBar
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          bedroomCount={bedroomCount}
          setBedroomCount={setBedroomCount}
          bedCount={bedCount}
          setBedCount={setBedCount}
          bathroomCount={bathroomCount}
          setBathroomCount={setBathroomCount}
          maxGuestCount={maxGuestCount}
          setMaxGuestCount={setMaxGuestCount}
          price={price}
          setPrice={setPrice}
        />
        <p className='p-5 text-start'>
          총 {hotels?.objData?.totalElements}개의 숙소가 검색되었습니다.
        </p>

        <form
          onSubmit={handleSearch}
          className='flex items-center max-w-md mx-auto mt-8 mb-10'>
          <input
            type='text'
            className='w-full p-2 border rounded-l-md focus:outline-none'
            placeholder='숙소를 검색해보세요!'
            value={kw}
            onChange={(e) => setKw(e.target.value)}
          />
          <button
            type='submit' // 버튼 타입을 submit으로 설정
            className='p-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-600'>
            <FiSearch className='w-6 h-6' />
          </button>
        </form>

        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 py-4 sm:gap-3 lg:gap-4 lg:px-4 mb-24 w-full'>
          {hotels?.objData.content?.map((hotel, index) => (
            <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
              <HotelListItem key={hotel.id} hotel={hotel} />
            </Link>
          ))}
        </ul>
      </div>
      <div className='flex justify-center my-4'>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={hotels?.objData?.totalPages}
        />
      </div>
    </div>
  )
}
