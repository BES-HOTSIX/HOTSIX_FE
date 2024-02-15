'use client'

import React from 'react'
import { Autocomplete, AutocompleteItem, Avatar } from '@nextui-org/react'
import { FaCity } from 'react-icons/fa'

export default function SearchCity({ city, setCity }) {
  return (
    <div>
      <div className='flex space-x-2 mt-2 ml-2'>
        <FaCity className='text-black' /> {/* 달력 아이콘 */}
        <span className='text-black'>도시 선택</span> {/* 문구 */}
      </div>
      <Autocomplete
        onSelectionChange={(e) => setCity(e)}
        className='max-w-xs'
        label='도시'>
        <AutocompleteItem
          key='서울'
          startContent={
            <Avatar
              alt='서울'
              className='w-6 h-6'
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Seal_of_Seoul%2C_South_Korea.svg/langko-1500px-Seal_of_Seoul%2C_South_Korea.svg.png'
            />
          }>
          서울
        </AutocompleteItem>
        <AutocompleteItem
          key='경기'
          startContent={
            <Avatar
              alt='경기'
              className='w-6 h-6'
              src='https://i.namu.wiki/i/RhnVU3OJCrIrRfLuThp7ZTixaYMSxqG1QkzHPLLkHdavjg6NtRpNYRNt9e_PWdsvOINWa9QiDl28GPu64bzpVA.svg'
            />
          }>
          경기
        </AutocompleteItem>
        <AutocompleteItem
          key='부산'
          startContent={
            <Avatar
              alt='부산'
              className='w-6 h-6'
              src='https://i.namu.wiki/i/TGNXtULyaRdmGVmuJ8Pp7scSLnGMKMljqg-GIvxIzJMOqW669MTrEXa9u25Ff0IiePBNt3ovDSC_fTYzurAUTw.svg'
            />
          }>
          부산
        </AutocompleteItem>
        <AutocompleteItem
          key='대구'
          startContent={
            <Avatar
              alt='대구'
              className='w-6 h-6'
              src='https://i.namu.wiki/i/_JSYeSmDDh-Uzg3o2o12A0Ig5xhmqWrYFyCQ-8F2jzl8nRGmTp1NMFWxGDisBwTZf8TNlxKePnIQnFGw5_j56w.svg'
            />
          }>
          대구
        </AutocompleteItem>
        <AutocompleteItem
          key='대전'
          startContent={
            <Avatar
              alt='대전'
              className='w-6 h-6'
              src='https://i.namu.wiki/i/lzbS2IjnPgBynSTCnvWpEmCoFzj1tb1xzlaeI-5peMK5QD6q0lXakB3rrpeEQInJJ4UHbOoRPwxgEvpp7OrSOA.svg'
            />
          }>
          대전
        </AutocompleteItem>
        <AutocompleteItem
          key='인천'
          startContent={
            <Avatar
              alt='인천'
              className='w-6 h-6'
              src='https://i.namu.wiki/i/3-cVWCOkubfAudzMOjVXO_eS8pYu4sx3PlW8jV-kdSbi6ikrkZFfZTwI7oc0jQgOLEf75p2cWHC3g__LvIXbxQ.svg'
            />
          }>
          인천
        </AutocompleteItem>
        <AutocompleteItem
          key='울산'
          startContent={
            <Avatar
              alt='울산'
              className='w-6 h-6'
              src='https://i.namu.wiki/i/JzN3TFx3Q1daKrO2sK0F5ZhomDc3Xc_DjIOuNdz5LvEp8wpn50UgAdxIXRQlYYEMAB4TTexGBwJXjRe6_VyUiQ.svg'
            />
          }>
          울산
        </AutocompleteItem>
        <AutocompleteItem
          key='광주'
          startContent={
            <Avatar
              alt='광주'
              className='w-6 h-6'
              src='https://i.namu.wiki/i/aWFdkoaJQegB71DJukdGvGZa2Ieu3Ct-k3zormF7yjNIC7j9KUQY58loIqlnK5a0jMktLcH5TI23Ni5Nbisvpg.svg'
            />
          }>
          광주
        </AutocompleteItem>
        <AutocompleteItem
          key='강원'
          startContent={
            <Avatar
              alt='강원'
              className='w-6 h-6'
              src='https://i.namu.wiki/i/nPVK6K7WdPBss5rV-K18AEuV8Zy6HXoeXqUVAEimHVg0-mzq6X0A3B4kTsMjoXqVPwx4H9CKXr66Tc8lomifAw.svg'
            />
          }>
          강원
        </AutocompleteItem>
        <AutocompleteItem
          key='충북'
          startContent={
            <Avatar
              alt='충북'
              className='w-6 h-6'
              src='https://blog.kakaocdn.net/dn/dtSEb0/btrFqbm5a72/jwvxvA218zA8vm0LTkc1KK/img.png'
            />
          }>
          충북
        </AutocompleteItem>
        <AutocompleteItem
          key='충남'
          startContent={
            <Avatar
              alt='충남'
              className='w-6 h-6'
              src='https://i.namu.wiki/i/NmdGLbvm2p5mv5KvKEA_R-PUD4Ts5q5KLVdjqZVaYDU7_yFt0ihtT_5dVIPAXthNxcynMAGiMpF30iJldEoj7w.svg'
            />
          }>
          충남
        </AutocompleteItem>
        <AutocompleteItem
          key='전북'
          startContent={
            <Avatar
              alt='전북'
              className='w-6 h-6'
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCF_eBcqcjQWwWTlXTwbJl1tMPJf0plLHSOg&usqp=CAU'
            />
          }>
          전북
        </AutocompleteItem>
        <AutocompleteItem
          key='전남'
          startContent={
            <Avatar
              alt='전남'
              className='w-6 h-6'
              src='https://i.namu.wiki/i/D4yPLU922vUfJN21JbmLvYlEZQk3as7MFiPdpL_1qYe1E1YjJfcGM5mVTnAtMl2uYNYJ8BRz3pZHXiEE7kYCzA.svg'
            />
          }>
          전남
        </AutocompleteItem>
        <AutocompleteItem
          key='경북'
          startContent={
            <Avatar
              alt='경북'
              className='w-6 h-6'
              src='https://www.gb.go.kr/Main/Images/new/ko/contents/symbol01.png'
            />
          }>
          경북
        </AutocompleteItem>
        <AutocompleteItem
          key='경남'
          startContent={
            <Avatar
              alt='경남'
              className='w-6 h-6'
              src='https://i.namu.wiki/i/vg6QNmQ5SqCZluJkG0jiTibKqlrbGMVdijw-ts80zx90o3HLiTiXTTqCTB4CJUyvtGI343zzK3cU6eMrUyBOMg.svg'
            />
          }>
          경남
        </AutocompleteItem>
      </Autocomplete>
    </div>
  )
}
