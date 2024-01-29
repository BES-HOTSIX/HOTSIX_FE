import React from 'react'
import KakaoSignInCallback from '@/components/auth/KakaoSignInCallback'

export default function page({ searchParams }) {
  console.log(searchParams)
  return <KakaoSignInCallback code={searchParams.code} />
}
