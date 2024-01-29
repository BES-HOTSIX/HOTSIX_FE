'use client'

import { useGoogleLoginUser } from '@/hooks/useUser'
import React, { useEffect } from 'react'

export default function GoogleSignInCallback({ code }) {
  console.log(code)

  const { submitGoogleLoginUser, isPending, isError, error } =
    useGoogleLoginUser()

  useEffect(() => {
    submitGoogleLoginUser(code)
  }, [])

  return <div>구글 로그인 중입니다...</div>
}
