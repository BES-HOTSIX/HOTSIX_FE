'use client'

import React, { useState } from 'react'
import { Input, Button } from '@nextui-org/react'
import { FaUser, FaLock } from 'react-icons/fa'
import { useLoginUser } from '@/hooks/useUser'
import KakaoLogin from './KakaoLogin'
import { GoogleLogin } from './GoogleLogin'
import NaverLogin from './NaverLogin'

export default function SignInForm() {
  const { submitLoginUser, isPending, isError, error } = useLoginUser()

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setLoginForm({
      ...loginForm,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    submitLoginUser(loginForm)
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='mt-32 min-h-[55vh]'>
        <form
          onSubmit={handleSubmit}
          className='p-6 bg-white rounded shadow-md'>
          <h2 className='flex justify-center text-lg font-semibold mb-4'>
            로그인
          </h2>
          <div className='mb-4'>
            <Input
              clearable
              bordered
              fullWidth
              color='primary'
              size='sm'
              placeholder='Username'
              contentLeft={<FaUser />}
              name='username'
              value={loginForm.username}
              onChange={handleChange}
            />
          </div>
          <div className='mb-4'>
            <Input
              clearable
              bordered
              fullWidth
              color='primary'
              size='sm'
              type='password'
              placeholder='Password'
              contentLeft={<FaLock />}
              name='password'
              value={loginForm.password}
              onChange={handleChange}
            />
          </div>
          <Button fullWidth size='lg' type='submit'>
            로그인
          </Button>

          <KakaoLogin />
          <NaverLogin />
          <GoogleLogin />
        </form>
      </div>
    </div>
  )
}
