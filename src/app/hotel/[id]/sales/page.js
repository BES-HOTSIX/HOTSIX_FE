import HotelSales from '@/components/hotel/HotelSales'
import React from 'react'

export default function page({ params: { id } }) {
  return <HotelSales id={id} />
}
