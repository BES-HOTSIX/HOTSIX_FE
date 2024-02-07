'use client'

import Image from 'next/image'
import googleLoginImage from '@/../../public/img/google_login.png'

export const GoogleLogin = () => {
  const handleLogin = (e) => {
    e.preventDefault()

    const googleLoginURL = 'https://accounts.google.com/o/oauth2/v2/auth'
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI // 여러분의 리다이렉트 URI
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const scope =
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scope,
      access_type: 'offline',
    })

    window.location.href = `${googleLoginURL}?${params.toString()}`
  }

  return (
    <button
      onClick={handleLogin}
      className='flex items-center justify-center rounded'>
      <Image
        className='ml-0'
        src="/img/google_login.png"  // 상대 경로로 이미지 지정
        alt='구글로 로그인'
        height={50}
        width={300}
      />
    </button>
  )
}
