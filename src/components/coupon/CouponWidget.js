'use client'

import React from 'react'

const CouponWidget = ({ coupons, onSelectCoupon, selectedCouponType }) => {
  return (
    <div className='mt-4 bg-white shadow-md rounded-lg max-w-md mx-auto'>
      {coupons.objData.map((coupon) => (
        <div
          key={coupon.couponType}
          className={`p-4 border-b cursor-pointer ${
            selectedCouponType === coupon.couponType
              ? 'bg-blue-100 border-blue-500'
              : 'border-gray-300'
          }`}
          onClick={() =>
            onSelectCoupon(
              coupon.couponType === selectedCouponType
                ? null
                : coupon.couponType
            )
          }>
          {coupon.couponType === '신규회원'
            ? `${coupon.couponType} - ${(coupon.discountRate * 100).toFixed(
                0
              )}% 할인 (최대 3만원)`
            : `${coupon.couponType} - ${(coupon.discountRate * 100).toFixed(
                0
              )}% 할인`}
        </div>
      ))}
    </div>
  )
}

export default CouponWidget
