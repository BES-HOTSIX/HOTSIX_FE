import React from 'react'
import NaverSignInCallback from '@/components/auth/NaverSignInCallback'

export default function page({ searchParams }) {
  console.log(searchParams)
  return <NaverSignInCallback secret={searchParams} />
}
