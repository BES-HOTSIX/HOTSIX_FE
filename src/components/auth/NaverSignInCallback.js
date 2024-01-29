'use client'

import { useNaverLoginUser } from '@/hooks/useUser'
import React, { useEffect } from 'react'
import { useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE } from 'recoil'

export default function NaverSignInCallback({ secret }) {
  const { submitNaverLoginUser, isPending, isError, error } =
    useNaverLoginUser()

  useEffect(() => {
    submitNaverLoginUser(secret)
  }, [])

  return <div>네이버 로그인 중입니다...</div>
}
