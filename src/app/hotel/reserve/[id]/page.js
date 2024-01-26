import HotelReservation from '@/components/reservation/HotelReservation'
import React from 'react'

export default function page({ params: { id } }) {
  return <HotelReservation id={id} />
}
