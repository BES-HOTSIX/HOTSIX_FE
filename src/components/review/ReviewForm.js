// src/components/review/ReviewForm.js

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const ReviewForm = ({ reservationId, hotelId, onReviewSubmit }) => {
  const [body, setBody] = useState('')
  const [ratings, setRatings] = useState({
    amenities: 0,
    staffService: 0,
    cleanliness: 0,
  })

  const router = useRouter()

  const handleStarClick = (category, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [category]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/review/add/${hotelId}/${reservationId}`,
        {
          body,
          amenities: ratings.amenities,
          staffService: ratings.staffService,
          cleanliness: ratings.cleanliness,
        }
      )

      // 추가 필요: 등록 후 페이지 이동

      // 부모 컴포넌트에 등록 완료를 알리기 위해 콜백 호출
      if (typeof onReviewSubmit === 'function') {
        onReviewSubmit()
      }

      alert('리뷰가 등록되었습니다.')
      router.push(`/hotel/${hotelId}`)
    } catch (error) {
      console.error('리뷰 등록 오류:', error)
      console.error('서버 응답 데이터:', error.response?.data)

      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className='mt-32'>
      <form onSubmit={handleSubmit}>
        <label>
          리뷰를 작성해주세요:
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{
              width: '100%',
              minHeight: '100px',
              border: '1px solid lightgray',
              borderRadius: '8px',
              padding: '8px',
              margin: '8px 0',
            }}
          />
        </label>
        <br />
        <label>
          편의시설 평가:
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              style={{
                cursor: 'pointer',
                fontSize: '24px',
                marginRight: '8px',
                color: value <= ratings.amenities ? 'gold' : 'lightgray',
              }}
              onClick={() => handleStarClick('amenities', value)}>
              ★
            </span>
          ))}
        </label>
        <br />
        <label>
          서비스 평가:
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              style={{
                cursor: 'pointer',
                fontSize: '24px',
                marginRight: '8px',
                color: value <= ratings.staffService ? 'gold' : 'lightgray',
              }}
              onClick={() => handleStarClick('staffService', value)}>
              ★
            </span>
          ))}
        </label>
        <br />
        <label>
          청결도 평가:
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              style={{
                cursor: 'pointer',
                fontSize: '24px',
                marginRight: '8px',
                color: value <= ratings.cleanliness ? 'gold' : 'lightgray',
              }}
              onClick={() => handleStarClick('cleanliness', value)}>
              ★
            </span>
          ))}
        </label>
        <br />
        <button
          type='submit'
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            marginTop: '10px',
          }}>
          리뷰 등록
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
