// src/app/review/[id]/page.js

import React from 'react'
import HotelDetail from '@/components/review/ReviewTest'

export const metadata = {
  title: 'Hotel',
}

export default function page({ params: { id } }) {
  return <HotelDetail id={id} />
}