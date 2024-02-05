import SearchPage from '@/components/hotel/search/SearchPage'
import React from 'react'

export default function page({ searchParams }) {
  const { city, startDate, endDate } = searchParams

  console.log(city, startDate, endDate)
  return <SearchPage city={city} startDate={startDate} endDate={endDate} />
}
