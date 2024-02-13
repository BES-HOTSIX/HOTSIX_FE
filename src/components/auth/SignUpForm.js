'use client'

import React, { useState } from 'react'
import { Input, Button, Avatar, FaEnvelope } from '@nextui-org/react'
import { FaUser, FaLock, FaPen } from 'react-icons/fa'
import { useRegisterUser } from '@/hooks/useUser'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

export default function SignUpForm() {
  const { submitRegisterUser } = useRegisterUser()

  const [signupForm, setSignupForm] = useState({
    imageUrl: '',
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: '',
  })

  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    message: '',
  })

  const [passwordMatch, setPasswordMatch] = useState(true)
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('')

  const [selectedImage, setSelectedImage] = useState(null)

  const [isUsernameEntered, setIsUsernameEntered] = useState(false)
  const [isPasswordEntered, setIsPasswordEntered] = useState(false)
  const [isConfirmPasswordEntered, setIsConfirmPasswordEntered] =
    useState(false)
  const [isNicknameEntered, setIsNicknameEntered] = useState(false)
  const [isEmailEntered, setIsEmailEntered] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', 'ejnekuco') // 업로드 프리셋을 설정하세요

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dlfl2w8hk/image/upload',
        formData
      )
      if (response.status === 200) {
        return response.data.secure_url // 업로드된 이미지의 URL 반환
      } else {
        throw new Error('이미지 업로드 실패')
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
      throw error
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSignupForm({
      ...signupForm,
      [name]: value,
    })

    if (name === 'password') {
      checkPasswordStrength(value)
    }

    if (name === 'confirmPassword') {
      setPasswordMatch(signupForm.password === value)
      if (signupForm.password !== value) {
        setConfirmPasswordMessage('비밀번호가 일치하지 않습니다.')
      } else {
        setConfirmPasswordMessage('')
      }
    }

    // 입력 여부에 따라 State 업데이트
    if (name === 'username') {
      setIsUsernameEntered(!!value) // 값이 비어있지 않으면 true, 비어있으면 false
    }

    if (name === 'password') {
      setIsPasswordEntered(!!value)
    }

    if (name === 'confirmPassword') {
      setIsConfirmPasswordEntered(!!value)
    }

    if (name === 'nickname') {
      setIsNicknameEntered(!!value)
    }

    if (name === 'email') {
      setIsEmailEntered(!!value)
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

    const isValid = isUpperCase && isLowerCase && isSpecialChar && isLengthValid

    setPasswordStrength({
      isValid,
      message: isValid
        ? '비밀번호가 안전합니다.'
        : '대소문자, 특수문자를 포함하고 7자 이상이어야 합니다.',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return
    }

    if (
      signupForm.username.trim() === '' ||
      signupForm.password.trim() === '' ||
      signupForm.nickname.trim() === '' ||
      signupForm.email.trim() === ''
    ) {
      toast.error('모든 필수 항목을 입력하세요.')
      return
    }

    if (!passwordStrength.isValid) {
      toast.error(passwordStrength.message)
      return
    }

    try {
      if (!selectedImage) {
        toast.error('프로필 이미지를 등록하세요.')
      }

      const imageUrl = await uploadImageToCloudinary(selectedImage)
      const formData = {
        ...signupForm,
        imageUrl: imageUrl,
      }
      // 서버로 formData를 전송하는 로직
      await submitRegisterUser(formData) // 백엔드로 전송
    } catch (error) {
      return
    }
  }

  const goToSignIn = () => {
    window.location.href = '/auth/signin'
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className=' mt-32 min-h-[55vh]'>
        <form
          onSubmit={handleSubmit}
          className='p-6 bg-white rounded shadow-md max-w-full mx-auto'
          style={{ width: '30vw' }}>
          <h2 className='flex justify-center text-lg font-semibold mb-4'>
            회원가입
          </h2>
          <div className='mb-4 flex justify-center'>
            <label
              htmlFor='profileImage'
              className='cursor-pointer flex items-center space-x-2'>
              <span className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt='Profile'
                    className='w-full h-full rounded-full'
                  />
                ) : (
                  <svg
                    className='w-6 h-6 text-gray-500'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                    />
                  </svg>
                )}
              </span>
              <span className='text-sm text-gray-600'>프로필 이미지 선택</span>
            </label>
            <input
              type='file'
              id='profileImage'
              accept='image/*'
              className='hidden'
              onChange={handleImageChange}
            />
          </div>
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
              value={signupForm.username}
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
              value={signupForm.password}
              onChange={handleChange}
              style={{ opacity: isPasswordEntered ? 1 : 0.3 }}
            />
            <div className='text-sm text-gray-500 mt-1'>
              {passwordStrength.message}
            </div>
          </div>
          <div className='mb-4'>
            <Input
              clearable
              bordered
              fullWidth
              color='primary'
              size='sm'
              type='password'
              placeholder='패스워드 확인'
              contentLeft={<FaLock />}
              name='confirmPassword'
              value={signupForm.confirmPassword}
              onChange={handleChange}
              style={{ opacity: isConfirmPasswordEntered ? 1 : 0.3 }}
            />
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
              placeholder='닉네임'
              contentLeft={<FaPen />}
              name='nickname'
              value={signupForm.nickname}
              onChange={handleChange}
              style={{ opacity: isNicknameEntered ? 1 : 0.3 }}
            />
          </div>
          <div className='mb-4'>
            <Input
              clearable
              bordered
              fullWidth
              color='primary'
              size='sm'
              placeholder='이메일'
              contentLeft={<FaEnvelope />}
              name='email'
              value={signupForm.email}
              onChange={handleChange}
              style={{ opacity: isEmailEntered ? 1 : 0.3 }}
            />
          </div>
          <Button fullWidth size='lg' type='submit'>
            가입하기
          </Button>
          {/* 로그인 바로가기 */}
          <p
            className='mt-4 text-sm text-gray-600 cursor-pointer text-blue-500 text-center' // text-center 추가
            onClick={goToSignIn}>
            로그인 바로가기
          </p>
        </form>
      </div>
    </div>
  )
}
