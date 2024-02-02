'use client'

import React, { useState } from 'react';
import { Input, Button, Avatar } from '@nextui-org/react';
import { FaUser, FaLock, FaPen } from 'react-icons/fa';
import { useRegisterUser } from '@/hooks/useUser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUpForm() {
  const { submitRegisterUser } = useRegisterUser();

  const [signupForm, setSignupForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });

  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    message: '',
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');

  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({
      ...signupForm,
      [name]: value,
    });

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
  };

  const handleImageUpload = (files) => {
    const selectedFile = files[0];
    setSelectedImage(selectedFile);
    toast.success(selectedFile ? '프로필 이미지가 등록되었습니다.' : '프로필 이미지를 선택해주세요.');
  };

  const checkPasswordStrength = (password) => {
    const regexUpperCase = /[A-Z]/;
    const regexLowerCase = /[a-z]/;
    const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const minLength = 7;

    const isUpperCase = regexUpperCase.test(password);
    const isLowerCase = regexLowerCase.test(password);
    const isSpecialChar = regexSpecialChar.test(password);
    const isLengthValid = password.length >= minLength;

    const isValid = isUpperCase && isLowerCase && isSpecialChar && isLengthValid;

    setPasswordStrength({
      isValid,
      message: isValid ? '비밀번호가 안전합니다.' : '대소문자, 특수문자를 포함하고 7자 이상이어야 합니다.',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return;
    }

    if (signupForm.username.trim() === '' || signupForm.password.trim() === '' || signupForm.nickname.trim() === '') {
      toast.error('모든 필수 항목을 입력하세요.')
      return
    }

    if (!passwordStrength.isValid) {
      toast.error(passwordStrength.message)
      return;
    }

    // 이미지 업로드 함수 호출
  if (!selectedImage) {
    // 이미지가 선택되지 않은 경우 알림 표시
    toast.error('프로필 이미지를 선택해주세요.')
    return;
  }

    handleImageUpload(selectedImage)

    submitRegisterUser(signupForm)
  }

  const goToSignIn = () => {
    window.location.href = '/auth/signin';
  };

  return (
    <div className='flex flex-col items-center justify-center h-[70vh]'>
      <form onSubmit={handleSubmit} className='p-6 bg-white rounded shadow-md' style={{ maxWidth: '350px', width: '100%' }}>
        <h2 className='flex justify-center text-lg font-semibold mb-4'>
          회원가입
        </h2>
        <div className='mb-4 flex items-center justify-center'>
          <label htmlFor='profileImage' className='cursor-pointer'>
            <Avatar
              src={selectedImage ? URL.createObjectURL(selectedImage) : null}
              size='xl'
              alt='프로필 이미지'
            />
            <input
              type='file'
              accept='image/*'
              id='profileImage'
              className='hidden'
              onChange={(e) => handleImageUpload(e.target.files)}
            />
          </label>
        </div>
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
        {/* 로그인 바로가기 */}
        <p
          className='mt-4 text-sm text-gray-600 cursor-pointer text-blue-500 text-center'  // text-center 추가
          onClick={goToSignIn}
        >
          로그인 바로가기
        </p>
      </form>
    </div>
  )
}
