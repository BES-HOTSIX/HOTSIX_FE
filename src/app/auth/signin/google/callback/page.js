import React from 'react'
import GoogleSignInCallback from '@/components/auth/GoogleSignInCallback'

export default function page({ searchParams }) {
  return <GoogleSignInCallback code={searchParams.code} />
}
