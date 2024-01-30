'use client'

import React, { useState, useEffect } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import axios from '@/config/axios-config'
import { Button, Text } from '@nextui-org/react'

const LikeButton = ({ hotelId }) => {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(
          `/api/v1/likes/status?&hotelId=${hotelId}`,
          {
            ...axios.defaults,
            useAuth: true,
          }
        )
        console.log(response.data)
        setLiked(response.data.liked)
        setLikes(response.data.likesCount)
      } catch (error) {
        console.error('좋아요 상태 조회 실패', error)
      }
    }

    fetchLikeStatus()
  }, [])

  const handleLike = async () => {
    try {
      const response = await axios.post(
        '/api/v1/likes/toggle',
        {
          hotelId: hotelId,
        },
        {
          ...axios.defaults,
          useAuth: true,
        }
      )
      console.log(response.data)
      setLiked(response.data.liked)
      setLikes(response.data.likesCount)
    } catch (error) {
      console.error('좋아요 상태 업데이트 실패', error)
    }
  }

  return (
    <Button
      className='bg-red-100'
      size='sm'
      color={liked ? 'danger' : 'default'}
      startContent={
        <AiFillHeart className={liked ? 'text-red-500' : 'text-white'} />
      }
      onClick={handleLike}>
      <span className={`font-bold ${liked ? 'text-black' : ''}`}>
        {liked ? '찜 취소' : '찜 하기'}
      </span>
      <span
        className={`ml-2 ${
          liked ? 'bg-red-100' : 'bg-transparent'
        } rounded-full px-2 text-black`}>
        {likes}
      </span>
    </Button>
  )
}

export default LikeButton
