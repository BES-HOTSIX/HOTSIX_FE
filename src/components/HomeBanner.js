import React from 'react'
import Image from 'next/image'
import mainBannerImage from '@/../public/img/home_banner.jpg'

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
      <div className='absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center'>
        {/* 배너 콘텐츠 */}
        <h1 className='text-4xl font-bold text-white'>
          <span>숙소 검색 추가 예정 </span>
          <br />
        </h1>
        {/* 메인 텍스트 */}

        {/* 탭 및 검색 바 추가 */}
        {/* ... */}
      </div>
    </section>
  )
}
