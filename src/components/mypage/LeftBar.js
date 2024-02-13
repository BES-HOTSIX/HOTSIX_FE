'use client'

import { Avatar, Spacer } from '@nextui-org/react'
import { FaArrowRight, FaUserCircle } from 'react-icons/fa'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LeftBar(props) {
  const pathName = usePathname()

  const items = [
    { text: '예약 내역', link: '/mypage/reservations' },
    { text: '내 정보', link: '/mypage/info' },
    { text: '결제 내역', link: '/cashLog/me' },
    { text: '내가 등록한 숙소', link: '/mypage/hotels' },
    { text: '내가 찜한 숙소', link: '/mypage/like' },
  ]

  return (
    <div className='flex flex-col items-center w-1/4 bg-[#CECECE]'>
      <Spacer y={5} />
      <div className={'text-2xl'}>마이페이지</div>
      <Spacer y={5} />
      {props.user?.objData.imageUrl ? (
        <Avatar src={props.user.objData.imageUrl} className={'w-44 h-44'} />
      ) : (
        <FaUserCircle size={100} />
      )}
      <Spacer y={5} />
      <div className={'text-2xl'}>{props.user?.objData.nickname}</div>
      <Spacer y={10} />
      <ul className={'flex flex-col w-full'}>
        {items.map((item, index) => (
          <Link href={item.link} key={`l-${index}`}>
            <li
              className={`w-full h-15 p-5 flex items-center  ${
                pathName === item.link
                  ? 'bg-white'
                  : 'hover:cursor-pointer bg-[#898989]'
              }`}>
              {item.text}
              {item.text === '캐시 사용 내역' && (
                <div className={'ml-auto'}>
                  <FaArrowRight />
                </div>
              )}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}
