'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import hostImage from '@/../public/img/host_image.jpg'
import guestImage from '@/../public/img/guest_image.jpg'
import { useUserRole } from '@/hooks/useUser'

export default function SelectRole() {
  const [selectedRole, setSelectedRole] = useState('HOST')
  const [showModal, setShowModal] = useState(false)
  const { submitUserRole, isPending, isError, error } = useUserRole()

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowModal(true)
  }

  const handleConfirm = () => {
    console.log(selectedRole)
    setShowModal(false)
    submitUserRole(selectedRole)
  }

  return (
    <div className='flex  items-center justify-center'>
      <div className='mt-32 min-h-[55vh] text-center'>
        <h2 className='text-3xl mb-12'>호스트 혹은 게스트로 선택해주세요.</h2>
        <div className='flex space-x-32'>
          <div
            className={`relative h-72 w-72 group ${
              selectedRole === 'HOST'
                ? 'border-4 border-gray-500'
                : 'border-4 border-transparent'
            }`}
            onClick={() =>
              setSelectedRole(selectedRole === 'HOST' ? null : 'HOST')
            }>
            <Image
              src={hostImage}
              alt='HOST'
              layout='fill'
              className='transition duration-300 ease-in-out'
            />
            <div className='absolute bottom-0 left-0 bg-white bg-opacity-75 w-full text-center font-bold py-2'>
              호스트
            </div>
          </div>
          <div
            className={`relative h-72 w-72 group ${
              selectedRole === 'GUEST'
                ? 'border-4 border-gray-500'
                : 'border-4 border-transparent'
            }`}
            onClick={() =>
              setSelectedRole(selectedRole === 'GUEST' ? null : 'GUEST')
            }>
            <Image
              src={guestImage}
              alt='GUEST'
              layout='fill'
              className='transition duration-300 ease-in-out'
            />
            <div className='absolute bottom-0 left-0 bg-white bg-opacity-75 w-full text-center font-bold py-2'>
              게스트
            </div>
          </div>
        </div>
        <div className='text-center mt-32'>
          <button
            onClick={handleSubmit}
            className='bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-10 rounded'>
            선택
          </button>
        </div>
      </div>
      {showModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center'>
          <div className='bg-white p-5 rounded-lg'>
            <p className='text-center'>
              {`당신은 ${
                selectedRole === 'HOST' ? '호스트' : '게스트'
              }로 선택하셨습니다. 계속하시겠습니까?`}
            </p>
            <div className='flex justify-center mt-4'>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2'
                onClick={handleConfirm}>
                네
              </button>
              <button
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                onClick={() => setShowModal(false)}>
                아니요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
