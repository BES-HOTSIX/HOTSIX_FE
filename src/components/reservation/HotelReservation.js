'use client'

import { useHotelDetail } from '@/hooks/useHotel'
import React from 'react'

export default function HotelReservation({ id }) {
  console.log(id)

  const { hotel, isLoading, isError, error } = useHotelDetail(id)

  if (isLoading) {
    return <div></div>
  }

  console.log(hotel)

  return <div>HotelReservation</div>
}
