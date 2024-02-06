'use client'

import React, { useState } from 'react'
import { Input, Button } from '@nextui-org/react'
import { FaUser, FaLock, FaPen } from 'react-icons/fa'
import { useRegisterUser } from '@/hooks/useUser'

export default function SignUpForm() {
  const { submitRegisterUser, isPending, isError, error } = useRegisterUser()

  const [signupForm, setSignupForm] = useState({
    username: '',
    password: '',
    nickname: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSignupForm({
      ...signupForm,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    submitRegisterUser(signupForm)
  }

  return (
    <div className='flex flex-col items-center justify-center h-[60vh]'>
      <form onSubmit={handleSubmit} className='p-6 bg-white rounded shadow-md'>
        <h2 className='flex justify-center text-lg font-semibold mb-4'>
          회원가입
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
            value={signupForm.username}
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
            value={signupForm.password}
            onChange={handleChange}
          />
        </div>
        <div className='mb-6'>
          <Input
            clearable
            bordered
            fullWidth
            color='primary'
            size='sm'
            placeholder='Nickname'
            contentLeft={<FaPen />}
            name='nickname'
            value={signupForm.nickname}
            onChange={handleChange}
          />
        </div>
        <Button fullWidth size='lg' type='submit'>
          가입하기
        </Button>
      </form>
    </div>
  )
}
