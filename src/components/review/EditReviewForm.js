// src/components/review/EditReviewForm.js
import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button, Input, Textarea } from "@nextui-org/react"

const EditReviewForm = ({ reviewId, onClose }) => {
  const [editedReview, setEditedReview] = useState({
    member: "",
    body: "",
    amenities: 0,
    staffService: 0,
    cleanliness: 0,
  })

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

  const handleUpdateReview = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/review/modify/${reviewId}`,
        editedReview
      )
      console.log("리뷰가 성공적으로 수정되었습니다.")
      // 수정 후 추가적인 처리가 필요하다면 onClose를 호출하여 처리할 수 있음
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error("리뷰 수정 중 오류 발생:", error)
      alert("리뷰 수정에 실패했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <div>
      <h3>리뷰 수정</h3>

      <label>리뷰 내용</label>
      <Textarea
        value={editedReview.body}
        onChange={(e) => handleInputChange("body", e.target.value)}
      />
      <label>편의시설 평점</label>
      <Input
        type='number'
        value={editedReview.amenities}
        onChange={(e) => handleInputChange("amenities", e.target.value)}
      />
      <label>서비스 평점</label>
      <Input
        type='number'
        value={editedReview.staffService}
        onChange={(e) => handleInputChange("staffService", e.target.value)}
      />
      <label>청결도 평점</label>
      <Input
        type='number'
        value={editedReview.cleanliness}
        onChange={(e) => handleInputChange("cleanliness", e.target.value)}
      />
      <Button
        onClick={handleUpdateReview}
        style={{ backgroundColor: "green", color: "white" }}
      >
        수정 완료
      </Button>
      <Button
        onClick={onClose}
        style={{ backgroundColor: "gray", color: "white" }}
      >
        닫기
      </Button>
    </div>
  )
}

export default EditReviewForm
