// src/components/review/ReviewForm.js

import React, { useState } from "react"
import axios from "@/config/axios-config"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ReviewForm = ({ reservationId, hotelId, onReviewSubmit }) => {
  const [body, setBody] = useState("")
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

    if (!body) {
      toast.error("리뷰 내용을 작성해주세요.")
      return
    }

    const isValidRating = (rating) => rating > 0 && rating <= 5

    if (
      !isValidRating(ratings.amenities) ||
      !isValidRating(ratings.staffService) ||
      !isValidRating(ratings.cleanliness)
    ) {
      toast.error("모든 항목의 별점을 입력해주세요.")
      return
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/review/add/${hotelId}/${reservationId}`,
        {
          body,
          amenities: ratings.amenities,
          staffService: ratings.staffService,
          cleanliness: ratings.cleanliness,
        },
        {
          ...axios.defaults,
          useAuth: true,
        }
      )

      // 부모 컴포넌트에 등록 완료를 알리기 위해 콜백 호출
      if (typeof onReviewSubmit === "function") {
        onReviewSubmit()
      }

      toast.success("리뷰가 등록되었습니다.")
      router.push(`/hotel/${hotelId}`)
    } catch (error) {
      console.error("리뷰 등록 오류:", error)
      console.error("서버 응답 데이터:", error.response?.data)

      toast.error("리뷰 등록에 실패했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <div className='h-[50vh] mt-32'>
      <form onSubmit={handleSubmit}>
        <label>
          <h4 style={{ fontSize: "25px" }}>리뷰를 작성해주세요</h4>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{
              width: "60%",
              minHeight: "100px",
              border: "3px solid lightgray",
              borderRadius: "10px",
              padding: "10px",
              margin: "30px 0",
            }}
          />
        </label>
        <br />
        <label>
          <p marginTop='10px'>편의시설 만족도</p>
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              style={{
                cursor: "pointer",
                fontSize: "26px",
                marginRight: "18px",
                color: value <= ratings.amenities ? "gold" : "lightgray",
              }}
              onClick={() => handleStarClick("amenities", value)}
            >
              ★
            </span>
          ))}
        </label>
        <br />
        <label style={{ margin: "10px" }}>
          <p marginTop='10px'>서비스 만족도</p>
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              style={{
                cursor: "pointer",
                fontSize: "26px",
                marginRight: "18px",
                color: value <= ratings.staffService ? "gold" : "lightgray",
              }}
              onClick={() => handleStarClick("staffService", value)}
            >
              ★
            </span>
          ))}
        </label>
        <br />
        <label style={{ margin: "10px" }}>
          <p marginTop='10px'>청결 만족도</p>
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              style={{
                cursor: "pointer",
                fontSize: "26px",
                marginRight: "18px",
                color: value <= ratings.cleanliness ? "gold" : "lightgray",
              }}
              onClick={() => handleStarClick("cleanliness", value)}
            >
              ★
            </span>
          ))}
        </label>
        <br />
        <button
          type='submit'
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          리뷰 등록
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
