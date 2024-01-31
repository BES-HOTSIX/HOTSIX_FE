import React from 'react'
import HotelDetail from '@/components/hotel/HotelDetail'

export const metadata = {
  title: 'Hotel',
}

export default function page({ params: { id } }) {
  return <HotelDetail id={id} />
}
