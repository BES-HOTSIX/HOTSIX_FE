'use client'

import React, { useState } from 'react'
import { Input, Button } from '@nextui-org/react'
import { FaUser, FaLock, FaPen } from 'react-icons/fa'
import { useRegisterUser } from '@/hooks/useUser'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function SignUpForm() {
  const { submitRegisterUser, isPending, isError, error } = useRegisterUser()

  const [signupForm, setSignupForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  })

  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    message: '',
  })

  // Confirm Password 일치 여부 상태
  const [passwordMatch, setPasswordMatch] = useState(true); 

  // Confirm Password 필드에 대한 상태와 메시지
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target
    setSignupForm({
      ...signupForm,
      [name]: value,
    })

    if (name === 'password') {
      checkPasswordStrength(value);
    }

    if (name === 'confirmPassword') {
      setPasswordMatch(signupForm.password === value);
      if (signupForm.password !== value) {
        setConfirmPasswordMessage('비밀번호가 일치하지 않습니다.');
      } else {
        setConfirmPasswordMessage('');
      }
    }
  }
  const checkPasswordStrength = (password) => {
    const regexUpperCase = /[A-Z]/
    const regexLowerCase = /[a-z]/
    const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/
    const minLength = 7

    const isUpperCase = regexUpperCase.test(password)
    const isLowerCase = regexLowerCase.test(password)
    const isSpecialChar = regexSpecialChar.test(password)
    const isLengthValid = password.length >= minLength

    const isValid =
      isUpperCase && isLowerCase && isSpecialChar && isLengthValid

    setPasswordStrength({
      isValid,
      message: isValid
        ? '비밀번호가 안전합니다.'
        : '대소문자, 특수문자를 포함하고 7자 이상이어야 합니다.',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // 비밀번호 확인 로직 추가
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return 
    }

    // 추가: 입력란이 빈칸인 경우 메시지 출력
    if (signupForm.username.trim() === '') {
      alert('유저네임을 입력하십시오.');
      return;
    }

    if (signupForm.nickname.trim() === '') {
      alert('닉네임을 입력하십시오.');
      return;
    }

    if (signupForm.password.trim() === '') {
      alert('비밀번호를 입력하십시오.');
      return;
    }

    if (!passwordStrength.isValid) {
      alert(passwordStrength.message)
      return
    }

    submitRegisterUser(signupForm)
  }

  return (
    <div className='flex flex-col items-center justify-center h-[70vh]'>
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
        <div className='text-sm text-gray-500 mt-1'>
            {passwordStrength.message}
          </div>
        </div>
        <div className='mb-4'>
          {/* Confirm Password 필드 */}
          <Input
            clearable
            bordered
            fullWidth
            color='primary'
            size='sm'
            type='password'
            placeholder='Confirm Password'
            contentLeft={<FaLock />}
            name='confirmPassword'
            value={signupForm.confirmPassword}
            onChange={handleChange}
          />
          {/* Confirm Password 일치 여부 및 메시지 표시 */}
          {!passwordMatch && (
            <div className='text-sm text-red-500 mt-1'>
              {confirmPasswordMessage}
            </div>
          )}
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
