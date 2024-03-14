'use client'

import React, { useState } from 'react'

const CouponButton = ({ onClick }) => {
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    setIsActive(!isActive)
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      className={`${
        isActive ? 'bg-blue-700' : 'bg-blue-500'
      } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>
      {isActive ? '쿠폰함 닫기' : '쿠폰함'}
    </button>
  )
}

export default CouponButton
