import React from 'react'

export default function Footer() {
  return (
    <footer className='font-omyu text-xl hidden md:block w-full h-auto order-2 bottom-0 mt-52'>
      <div className='w-full h-[180px] bg-gray-100'>
        <div className='max-w-screen-xl mx-auto flex justify-between p-8'>
          <div className='flex flex-col text-center'>
            <p className='text-2xl font-bold my-3 mb-3 mr-20'>HOTSHARE</p>
          </div>

          <div className='flex-grow flex space-x-10 items-center'>
            <div className='flex flex-col space-y-2 '>
              <div className='text-md font-semibold mb-2'>회원</div>
              <a
                href='https://github.com/bhj2bb'
                className='hover:text-blue-500 underline underline-offset-4'>
                배현준
              </a>
            </div>

            <div className='flex flex-col space-y-2 '>
              <div className='text-md font-semibold mb-2'>숙소</div>
              <a
                href='https://github.com/js030'
                className='hover:text-blue-500 underline underline-offset-4'>
                김겸호
              </a>
            </div>

            <div className='flex flex-col space-y-2 '>
              <div className='text-md font-semibold mb-2'>예약</div>
              <a
                href='https://github.com/jkeum-dev'
                className='hover:text-blue-500 underline underline-offset-4'>
                금시연
              </a>
            </div>

            <div className='flex flex-col space-y-2 '>
              <div className='text-md font-semibold mb-2'>결제</div>
              <a
                href='https://github.com/hagd0520'
                className='hover:text-blue-500 underline underline-offset-4'>
                김경환
              </a>
            </div>

            <div className='flex flex-col space-y-2 '>
              <div className='text-md font-semibold mb-2'>리뷰</div>
              <a
                href='https://github.com/leeyuhyun0104'
                className='hover:text-blue-500 underline underline-offset-4'>
                이유현
              </a>
            </div>

            <div className='flex flex-col space-y-2 '>
              <div className='text-md font-semibold mb-2'>마이페이지</div>
              <a
                href='https://github.com/git990412'
                className='hover:text-blue-500 underline underline-offset-4'>
                정주영
              </a>
            </div>
          </div>

          <div className='flex flex-col space-y-2'>
            <div className='text-md font-semibold'>깃허브 주소</div>
            <div>
              <a
                href='https://github.com/BES-HOTSIX/HOTSIX_FE'
                className='hover:text-blue-500 underline underline-offset-4'>
                FRONTEND
              </a>
            </div>
            <div>
              <a
                href='https://github.com/BES-HOTSIX/HOTSIX_BE'
                className='hover:text-blue-500 underline underline-offset-4'>
                BACKEND
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
