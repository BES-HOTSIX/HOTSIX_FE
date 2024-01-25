import React from 'react'
import ReservationCancelDetail from '@/components/reservation/ReservationCancelDetail'

export default function page({ params: { id } }) {
  return <ReservationCancelDetail id={id} />
}
