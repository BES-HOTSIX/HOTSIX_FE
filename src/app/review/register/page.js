// src/app/review/register/page.js
"use client";
import ReviewForm from "@/components/review/ReviewForm";

const ReviewRegisterPage = () => {
  const hotelId = 1;
  return (
    <div>
      <h1>리뷰 등록 페이지</h1>
      <ReviewForm hotelId={hotelId} />
    </div>
  );
};

export default ReviewRegisterPage;
