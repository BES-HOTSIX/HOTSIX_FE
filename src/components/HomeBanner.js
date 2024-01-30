import React from 'react'
import Image from 'next/image'
import mainBannerImage from '@/../public/img/home_banner.jpg'
import SearchCity from './hotel/search/SearchCity'
import SearchDate from './hotel/search/SearchDate'
import { FaSearch } from 'react-icons/fa'
import { Button } from '@nextui-org/react'

export default function HomeBanner() {
  return (
    <section
      role='region'
      aria-label='상단 메인 비주얼'
      className='relative w-full h-[400px]'>
      {' '}
      {/* 높이 설정 추가 */}
      <Image
        src={mainBannerImage}
        alt='상단 메인 이미지'
        layout='fill'
        objectFit='cover' // 비율 유지 및 컨테이너 채우기
        className='w-full h-full'
      />
      {/* 배경 이미지 */}
      <div className='absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center mt-14'>
        {/* 배너 콘텐츠 */}
        <h1 className='text-2xl font-bold text-white'>
          <span>숙소를 검색해주세요. </span>
          <br />
        </h1>
        {/* 메인 텍스트 */}

        {/* 탭 및 검색 바 추가 */}
        <div className='flex flex-wrap items-center justify-center space-x-10 md:space-x-8  md:space-y-2 space-y-5  md:mt-4 w-[80vw] bg-white rounded-lg p-5'>
          <SearchCity />
          <SearchDate />

          <Button
            isIconOnly
            size='lg'
            color='primary'
            variant='faded'
            aria-label='Take a photo'
            className='mt-5'>
            <FaSearch />
          </Button>
        </div>
      </div>
    </section>
  )
}
