import HotelAllPictures from '@/components/hotel/HotelAllPictures'
import React from 'react'

export default function page({ params: { id } }) {
  return <HotelAllPictures id={id} />
}
