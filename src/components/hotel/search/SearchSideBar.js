'use client'

import React, { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi' // 메뉴 열기/닫기 아이콘
import { MdRemove, MdAdd } from 'react-icons/md'

export default function SearchSideBar({
  isOpen,
  toggleSidebar,
  bedroomCount,
  setBedroomCount,
  bedCount,
  setBedCount,
  bathroomCount,
  setBathroomCount,
  maxGuestCount,
  setMaxGuestCount,
  price,
  setPrice,
}) {
  const handleIncrement = (setter) => () => setter((prev) => prev + 1)
  const handleDecrement = (setter) => () =>
    setter((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <>
      <button
        onClick={toggleSidebar}
        className='fixed z-20 top-24 left-4 p-2 bg-gray-300 text-white rounded'>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>
      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center'>
          <div className='w-full max-w-md p-5 bg-white rounded-lg'>
            <p className='text-lg font-semibold'>필터링 조건</p>
            <div className='flex items-center space-x-2 p-3  border-b border-gray-200'>
              <p>침실의 개수:</p>
              <button
                className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300 hover:bg-red-500 text-white'
                onClick={handleDecrement(setBedroomCount)}>
                <MdRemove />
              </button>
              <p>{bedroomCount}</p>
              <button
                className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
                onClick={handleIncrement(setBedroomCount)}>
                <MdAdd />
              </button>
            </div>
            <div className='flex items-center space-x-2 p-3   border-b border-gray-200'>
              <p>침대의 개수:</p>
              <button
                className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300 hover:bg-red-500 text-white'
                onClick={handleDecrement(setBedCount)}>
                <MdRemove />
              </button>
              <p>{bedCount}</p>
              <button
                className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
                onClick={handleIncrement(setBedCount)}>
                <MdAdd />
              </button>
            </div>
            <div className='flex items-center space-x-2 p-3  border-b border-gray-200'>
              <p>욕실의 개수:</p>
              <button
                className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300 hover:bg-red-500 text-white'
                onClick={handleDecrement(setBathroomCount)}>
                <MdRemove />
              </button>
              <p>{bathroomCount}</p>
              <button
                className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
                onClick={handleIncrement(setBathroomCount)}>
                <MdAdd />
              </button>
            </div>
            <div className='flex items-center space-x-2 p-3  border-b '>
              <p>최대 수용가능 인원:</p>
              <button
                className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-300  hover:bg-red-500 text-white'
                onClick={handleDecrement(setMaxGuestCount)}>
                <MdRemove />
              </button>
              <p>{maxGuestCount}</p>
              <button
                className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-300 hover:bg-blue-500 text-white'
                onClick={handleIncrement(setMaxGuestCount)}>
                <MdAdd />
              </button>
            </div>
            <div className='flex items-center space-x-2 p-3 border-b'>
              <p>하루 숙박비:</p>
              <input
                type='text'
                placeholder='하루 숙박비 입력'
                value={price}
                onChange={(e) => {
                  // 숫자만 입력되도록 검증
                  const value = e.target.value
                  const re = /^[0-9\b]+$/ // 숫자와 백스페이스 허용
                  if (value === '' || re.test(value)) {
                    setPrice(value)
                  }
                }}
                className='w-2/3 p-1 border rounded'
              />
              <p>원</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className='mt-4 p-2 bg-red-500 text-white rounded'>
            닫기
          </button>
        </div>
      )}
    </>
  )
}
