'use client'

import React, { useEffect } from 'react'
import kakaoLoginImage from '@/../../public/img/kakao_login.png'
import Image from 'next/image'

export default function KakaoLogin() {
  useEffect(() => {
    // 카카오 SDK 스크립트 로드
    const loadKakaoSDK = () => {
      if (window.Kakao && window.Kakao.isInitialized()) {
        return
      }

      const script = document.createElement('script')
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js'
      script.onload = () => {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY)
      }
      document.head.appendChild(script)
    }

    loadKakaoSDK()
  }, [])

  const handleKaKaoLoginButton = (e) => {
    e.preventDefault()
    if (!window.Kakao || !window.Kakao.Auth) {
      console.error('카카오 SDK가 로드되지 않았거나, Auth 객체가 없습니다.')
      return
    }

    // 리디렉트 URI 설정
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI

    // Kakao.Auth.authorize를 호출하여 카카오 로그인 페이지로 리디렉션
    window.Kakao.Auth.authorize({
      redirectUri: redirectUri,
    })
  }

  return (
  <button
    onClick={handleKaKaoLoginButton}
    className='flex items-center justify-center rounded'>
    <Image
      className='ml-0'
      src={kakaoLoginImage}
      alt='Kakao로 로그인'
      width={300}
      height={50}
    />
  </button>
)
}
