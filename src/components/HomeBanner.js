import React from 'react'
import Image from 'next/image'
import mainBannerImage from '@/../public/img/home_banner.jpg'
import SearchCity from './hotel/search/SearchCity'
import SearchDate from './hotel/search/SearchDate'
import { FaSearch } from 'react-icons/fa'
import { Button } from '@nextui-org/react'
import '@/styles/banner.css'

export default function HomeBanner() {
  return (
    <section
      role='region'
      aria-label='상단 메인 비주얼'
      className='relative w-full h-[400px]'>
      {' '}
      {/* 높이 설정 추가 */}
      <Image src={mainBannerImage} alt='상단 메인 이미지' fill />
      {/* 배경 이미지 */}
      <div className='absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center mt-14'>
        {/* 배너 콘텐츠 */}
        <h1 className='text-white text-2xl text-shadow-sm shadow-black mb-2'>
          <span>숙소를 검색해주세요. </span>
          <br />
        </h1>
        {/* 메인 텍스트 */}

        {/* 탭 및 검색 바 추가 */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-[1/5] bg-white rounded-lg p-5 mb-6'>
          <SearchCity />
          <SearchDate />
          <Button
            size='lg'
            color='primary'
            variant='bordered'
            aria-label='Search'
            className='justify-self-center md:justify-self-center self-center mt-2 lg:mr-20'>
            <FaSearch />
            검색
          </Button>
        </div>
      </div>
    </section>
  )
}
