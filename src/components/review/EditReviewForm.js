// src/components/review/EditReviewForm.js
import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button, Input, Textarea } from "@nextui-org/react"
import { useRouter } from "next/navigation"
//import { useRouter } from "next/router"

const EditReviewForm = ({ hotelId, reviewId, onClose, style }) => {
  const [editedReview, setEditedReview] = useState({
    member: "",
    body: "",
    amenities: 0,
    staffService: 0,
    cleanliness: 0,
  })

  const router = useRouter()

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/review/detail/${reviewId}`
        )
        const reviewDetails = response.data
        setEditedReview({
          member: reviewDetails.member,
          body: reviewDetails.body,
          amenities: reviewDetails.amenities,
          staffService: reviewDetails.staffService,
          cleanliness: reviewDetails.cleanliness,
        })
      } catch (error) {
        console.error("리뷰 정보를 불러오는 중 에러 발생:", error)
      }
    }

    fetchReviewDetails()
  }, [reviewId])

  const handleInputChange = (field, value) => {
    setEditedReview((prevReview) => ({
      ...prevReview,
      [field]: value,
    }))
  }

  const handleStarClick = (category, value) => {
    setEditedReview((prevReview) => ({
      ...prevReview,
      [category]: value,
    }))
  }

  const handleUpdateReview = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/review/modify/${reviewId}`,
        editedReview
      )
      alert("리뷰가 성공적으로 수정되었습니다.")

      if (onClose) {
        onClose()
        //router.reload()
      }
    } catch (error) {
      console.error("리뷰 수정 중 오류 발생:", error)
      alert("리뷰 수정에 실패했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <div style={{ padding: "30px", maxWidth: "400px", margin: "auto", style }}>
      <h4>리뷰 수정</h4>

      <label></label>
      <Textarea
        value={editedReview.body}
        onChange={(e) => handleInputChange("body", e.target.value)}
      />
      <div style={{ marginTop: "10px" }}>
        <label>편의시설 평가</label>
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            style={{
              cursor: "pointer",
              fontSize: "24px",
              marginRight: "8px",
              color: value <= editedReview.amenities ? "gold" : "lightgray",
            }}
            onClick={() => handleStarClick("amenities", value)}
          >
            ★
          </span>
        ))}
      </div>
      <br />
      <div style={{ marginTop: "10px" }}>
        <label>서비스 평가</label>
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            style={{
              cursor: "pointer",
              fontSize: "24px",
              marginRight: "8px",
              color: value <= editedReview.staffService ? "gold" : "lightgray",
            }}
            onClick={() => handleStarClick("staffService", value)}
          >
            ★
          </span>
        ))}
      </div>
      <br />
      <div style={{ marginTop: "10px" }}>
        <label>청결도 평가</label>
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            style={{
              cursor: "pointer",
              fontSize: "24px",
              marginRight: "8px",
              color: value <= editedReview.cleanliness ? "gold" : "lightgray",
            }}
            onClick={() => handleStarClick("cleanliness", value)}
          >
            ★
          </span>
        ))}
      </div>
      <br />
      <Button
        onClick={handleUpdateReview}
        style={{ backgroundColor: "green", color: "white" }}
      >
        수정 완료
      </Button>
    </div>
  )
}
export default EditReviewForm
