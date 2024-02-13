'use client'

import React, { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt } from 'react-icons/fa'
import { DateRange } from 'react-date-range'
import { addYears, addDays } from 'date-fns'
import ko from 'date-fns/locale/ko'
import { format } from 'date-fns'

import 'react-date-range/dist/styles.css' // 메인 스타일 파일
import 'react-date-range/dist/theme/default.css' // 테마 스타일 파일

export default function SearchDate({ date, setDate }) {
  // date 배열 구조 분해 할당을 통해 startDate와 endDate를 추출
  const [startDate, endDate] = date
  const today = new Date()
  const tomorrow = addDays(new Date(), 1)
  const twoYearsLater = addYears(new Date(), 2)
  const [isPickerOpen, setIsPickerOpen] = useState(false) // 날짜 선택기 표시 상태

  const onRangeChange = (ranges) => {
    console.log(ranges.searchSelection.startDate)
    console.log(ranges.searchSelection.endDate)

    setDate([ranges.searchSelection.startDate, ranges.searchSelection.endDate])
  }

  return (
    <div className='relative'>
      <div
        className='flex items-center space-x-2 cursor-pointer'
        onClick={() => setIsPickerOpen(!isPickerOpen)}>
        <FaCalendarAlt className='text-black' /> {/* 달력 아이콘 */}
        <span className='text-black'>날짜 선택</span> {/* 문구 */}
      </div>
      <div
        className='bg-gray-100 w-[365px] p-4 rounded-lg mt-2 cursor-pointer text-black'
        onClick={() => setIsPickerOpen(!isPickerOpen)}>
        {format(startDate, 'yyyy-MM-dd', { locale: ko })} -{' '}
        {format(endDate, 'yyyy-MM-dd', { locale: ko })}
      </div>
      {isPickerOpen && ( // 조건부 렌더링으로 날짜 선택기 표시
        <div className='absolute z-10 bg-white mt-2 p-4 rounded-lg shadow-lg'>
          <div className='flex justify-center w-full'>
            <DateRange
              locale={ko}
              editableDateInputs={false}
              onChange={onRangeChange}
              months={1}
              direction='horizontal'
              moveRangeOnFirstSelection={false}
              ranges={[{ startDate, endDate, key: 'searchSelection' }]}
              minDate={today}
              maxDate={twoYearsLater}
            />
          </div>
        </div>
      )}
    </div>
  )
}
