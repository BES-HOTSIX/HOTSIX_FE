'use client'

import React, { useState } from 'react'
import SearchCity from './SearchCity'
import SearchDate from './SearchDate'
import { FaSearch } from 'react-icons/fa'
import { Button } from '@nextui-org/react'
import { format } from 'date-fns' // date-fns 라이브러리를 사용하여 날짜를 포맷합니다.
import { useSearchHotels } from '@/hooks/useHotel'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  // 오늘 날짜와 다음 날짜 계산
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // 도시 검색 상태
  const [city, setCity] = useState('')
  // 날짜 검색 상태
  const [date, setDate] = useState([today, tomorrow]) // startDate와 endDate를 위한 배열 초기화
  const router = useRouter()

  // 검색 버튼 클릭 이벤트 핸들러
  const handleSearchClick = () => {
    const [start, end] = date

    // 날짜를 'yyyy-MM-dd' 포맷의 문자열로 변환
    const formattedStart = format(start, 'yyyy-MM-dd')
    const formattedEnd = format(end, 'yyyy-MM-dd')

    console.log(city, formattedStart, formattedEnd)
    // 검색 로직 실행...

    router.push(
      `/hotel/search?city=${city}&startDate=${formattedStart}&endDate=${formattedEnd}`
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-[1/5] bg-white rounded-lg p-5 '>
      <SearchCity city={city} setCity={setCity} />

      <SearchDate date={date} setDate={setDate} />

      <Button
        size='lg'
        color='primary'
        variant='bordered'
        aria-label='Search'
        className='justify-self-center md:justify-self-center self-center mt-7 lg:mr-20'
        onClick={handleSearchClick}>
        <FaSearch />
        검색
      </Button>
    </div>
  )
}
