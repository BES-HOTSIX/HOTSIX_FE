import React from 'react'
import ReservationDetail from '@/components/reservation/ReservationDetail'

export default function page({ params: { id } }) {
  return <ReservationDetail id={id} />
}
