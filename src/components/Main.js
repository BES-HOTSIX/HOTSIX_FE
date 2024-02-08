import React from 'react'
import HomeBanner from './HomeBanner'
import RecentHotels from './hotel/RecentHotels'

export default function Main() {
  return (
    <section className='flex flex-col justify-center items-center max-w-[850px] mx-auto my-20 mt-10'>
      <div className='w-screen'>
        <HomeBanner />
      </div>
      <div className='min-h-[30vh]'>
        <RecentHotels />
      </div>
    </section>
  )
}
