import React from 'react'
import HotelReservation from '@/components/reservation/HotelReservation'

export default function page({ params: { id } }) {
  return <HotelReservation id={id} />
}
