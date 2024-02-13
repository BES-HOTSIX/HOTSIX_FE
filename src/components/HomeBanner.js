import React from 'react'
import Image from 'next/image'
import mainBannerImage from '@/../public/img/home_banner.jpg'
import '@/styles/banner.css'
import SearchBar from './hotel/search/SearchBar'

export default function HomeBanner() {
  return (
    <section
      role='region'
      aria-label='상단 메인 비주얼'
      className='relative w-full min-h-[550px] bg-slate-200'>
      {/* 높이 설정 추가 */}
      <Image src={mainBannerImage} alt='상단 메인 이미지' fill />
      {/* 배경 이미지 */}
      <div className='absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center mt-32'>
        {/* 배너 콘텐츠 */}
        <h1 className='text-white text-2xl text-shadow-sm shadow-black mb-2'>
          <span>숙소를 검색해주세요.</span>
          <br />
        </h1>
        {/* 메인 텍스트 */}

        <SearchBar />

        {/* 탭 및 검색 바 추가 */}
      </div>
    </section>
  )
}
