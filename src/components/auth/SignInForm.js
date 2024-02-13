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

  // 입력 여부를 추적할 State
  const [isUsernameEntered, setIsUsernameEntered] = useState(false)
  const [isPasswordEntered, setIsPasswordEntered] = useState(false)

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setLoginForm({
      ...loginForm,
      [name]: value,
    })

    // 입력 여부에 따라 State 업데이트
    if (name === 'username') {
      setIsUsernameEntered(!!value) // 값이 비어있지 않으면 true, 비어있으면 false
    }

    if (name === 'password') {
      setIsPasswordEntered(!!value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    submitLoginUser(loginForm)
  }
  const goToSignUp = () => {
    window.location.href = '/auth/signup'
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
              placeholder='유저네임'
              contentLeft={<FaUser />}
              name='username'
              value={loginForm.username}
              onChange={handleChange}
              style={{ opacity: isUsernameEntered ? 1 : 0.3 }}
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
              placeholder='패스워드'
              contentLeft={<FaLock />}
              name='password'
              value={loginForm.password}
              onChange={handleChange}
              style={{ opacity: isPasswordEntered ? 1 : 0.3 }} //
            />
          </div>
          <Button fullWidth size='lg' type='submit'>
            로그인
          </Button>

          {/* 쇼셜 로그인 구분선 */}
          <div className='w-full my-4 flex items-center'>
            <div className='border-t border-gray-300 flex-grow'></div>
            <p className='mx-2 text-sm text-gray-600'>쇼셜 로그인</p>
            <div className='border-t border-gray-300 flex-grow'></div>
          </div>

          {/* 쇼셜 로그인 버튼과 문구 */}
          <div className='flex flex-col items-center'>
            <div className='flex flex-col gap-4'>
              <div className='hover:bg-gray-100 p-2 rounded-md cursor-pointer flex items-center justify-center transition-all duration-300 transform hover:border'>
                <KakaoLogin />
              </div>
              <div className='hover:bg-gray-100 p-2 rounded-md cursor-pointer flex items-center justify-center transition-all duration-300 transform hover:border'>
                <NaverLogin />
              </div>
              <div className='hover:bg-gray-100 p-2 rounded-md cursor-pointer flex items-center justify-center transition-all duration-300 transform hover:border'>
                <GoogleLogin />
              </div>
            </div>
          </div>
          {/* 회원가입 바로가기 */}
          <p
            className='mt-4 text-sm text-gray-600 cursor-pointer text-blue-500 text-center' // text-center 추가
            onClick={goToSignUp}>
            회원가입 바로가기
          </p>
        </form>
      </div>
    </div>
  )
}
