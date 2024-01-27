'use client'

import Image from 'next/image'
import googleLoginImage from '@/../../public/img/google_login.png'

export const GoogleLogin = () => {
  const handleLogin = () => {
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
      prompt: 'consent',
    })

    window.location.href = `${googleLoginURL}?${params.toString()}`
  }

  return (
    <button
      onClick={handleLogin}
      className='flex items-center justify-center w-full py-2 rounded mt-5'>
      <Image src={googleLoginImage} alt='구글로 로그인' />
    </button>
  )
}
