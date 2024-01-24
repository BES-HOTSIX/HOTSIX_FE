import HotelModify from '@/components/hotel/HotelModify'
import React from 'react'

export default function page({ params: { id } }) {
  return <HotelModify id={id} />
}
