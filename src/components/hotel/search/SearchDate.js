'use client'

import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt } from 'react-icons/fa'

export default function SearchDate() {
  const [dateRange, setDateRange] = useState([new Date(), new Date()])
  const [startDate, endDate] = dateRange

  return (
    <div className=''>
      <div className='flex space-x-2 ml-2'>
        <FaCalendarAlt className='text-black' /> {/* 달력 아이콘 */}
        <span className='text-black'>날짜 선택</span> {/* 문구 */}
      </div>
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => setDateRange(update)}
        dateFormat='yyyy/MM/dd'
        minDate={new Date()}
        className='custom-date-picker-style p-5 rounded-lg border border-black' // Tailwind CSS 클래스 적용
      />
    </div>
  )
}
