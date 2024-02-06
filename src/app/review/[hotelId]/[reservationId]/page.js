//src/app/review/[hotelId]/[reservationId]/page.js

"use client"
import { useParams } from "next/navigation"
import ReviewForm from "@/components/review/ReviewForm"

const ReviewRegisterPage = () => {
  // URL 경로에서 호텔 ID와 예약 ID를 받아옴
  const { hotelId, reservationId } = useParams()

  return (
    <div className='mt-32'>
      <h1>리뷰 등록 페이지</h1>
      {/* 호텔 ID와 예약 ID를 전달 */}
      <ReviewForm hotelId={hotelId} reservationId={reservationId} />
    </div>
  )
}

export default ReviewRegisterPage
