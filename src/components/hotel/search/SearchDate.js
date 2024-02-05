'use client'

import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt } from 'react-icons/fa'

export default function SearchDate({ date, setDate }) {
  // date 배열 구조 분해 할당을 통해 startDate와 endDate를 추출
  const [startDate, endDate] = date

  return (
    <div className=''>
      <div className='flex space-x-2 '>
        <FaCalendarAlt className='text-black' /> {/* 달력 아이콘 */}
        <span className='text-black'>날짜 선택</span> {/* 문구 */}
      </div>
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => setDate(update)}
        dateFormat='yyyy/MM/dd'
        minDate={new Date()}
        className='bg-gray-100 mb-2 p-4 rounded-lg border border-black' // Tailwind CSS 클래스 적용
      />
    </div>
  )
}
