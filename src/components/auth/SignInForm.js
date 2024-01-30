'use client';

import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useLoginUser } from '@/hooks/useUser';
import KakaoLogin from './KakaoLogin';
import { GoogleLogin } from './GoogleLogin';
import NaverLogin from './NaverLogin';

export default function SignInForm() {
  const { submitLoginUser, isPending, isError, error } = useLoginUser();

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    submitLoginUser(loginForm);
  };

  return (
    <div className='flex flex-col items-center justify-center h-[70vh]'>
      <form onSubmit={handleSubmit} className='p-6 bg-white rounded shadow-md'>
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
              <span>카카오 로그인</span>
              <KakaoLogin />
            </div>
            <div className='hover:bg-gray-100 p-2 rounded-md cursor-pointer flex items-center justify-center transition-all duration-300 transform hover:border'>
              <span>네이버 로그인</span>
              <NaverLogin />
            </div>
            <div className='hover:bg-gray-100 p-2 rounded-md cursor-pointer flex items-center justify-center transition-all duration-300 transform hover:border'>
              <span>구글 로그인</span>
              <GoogleLogin />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
