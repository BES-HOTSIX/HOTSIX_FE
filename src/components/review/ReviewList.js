// src/components/review/ReviewList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

const ReviewList = ({ hotelId }) => {
  const [recentReviews, setRecentReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalSize, setModalSize] = useState("md");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/review/${hotelId}`
      );
      setAllReviews(response.data);

      // 최근 4개 리뷰
      const recentReviewsData = response.data.slice(0, 4);
      setRecentReviews(recentReviewsData);
    } catch (error) {
      console.error("리뷰를 불러오는 중 에러 발생:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [hotelId]);

  const handleShowModal = (size) => {
    setShowModal(true);
    setModalSize(size);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? "gold" : "lightgray",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleDeleteReview = async (id) => {
    console.log("Review ID:", id);

    try {
      await axios.delete(`http://localhost:8080/api/v1/review/delete/${id}`);
      console.log("리뷰가 성공적으로 삭제되었습니다.");
      // 삭제 후 리뷰 다시 로드
      fetchReviews(); // 수정: 함수 내부에 있던 부분을 호출로 변경
      alert("리뷰가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("리뷰 삭제 중 오류 발생:", error);
      alert("리뷰 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 최근 리뷰를 2x2 그리드로 렌더링
  const renderRecentReviewsGrid = () => {
    if (recentReviews.length === 0) {
      return <p>등록된 리뷰가 없습니다.</p>;
    }
    const grid = [];
    for (let i = 0; i < recentReviews.length; i += 2) {
      const row = (
        <div
          key={i / 2}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          {recentReviews.slice(i, i + 2).map((review) => (
            <div key={review.id} style={{ flex: 1, padding: "10px" }}>
              <p>리뷰번호: {review.id}</p>
              <p>회원명: {review.member}</p>
              <p>
                평점: {renderStars(review.rating)} ({review.rating})
              </p>
              <p style={{ textAlign: "left", whiteSpace: "pre-line" }}>
                {review.body && review.body.length > 50 ? (
                  <>
                    {review.body.slice(0, 50)}
                    <br />
                    {review.body.slice(50)}
                  </>
                ) : (
                  review.body
                )}
              </p>
              <p>
                편의시설: {renderStars(review.amenities)} ({review.amenities})
              </p>
              <p>
                서비스: {renderStars(review.staffService)} (
                {review.staffService})
              </p>
              <p>
                청결도: {renderStars(review.cleanliness)} ({review.cleanliness})
              </p>
              {/* 삭제 버튼 추가 */}
              <Button
                onClick={() => handleDeleteReview(review.id)}
                style={{ backgroundColor: "red", color: "white" }}
              >
                삭제
              </Button>
            </div>
          ))}
        </div>
      );
      grid.push(row);
    }
    return grid;
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h2>최근 리뷰</h2>
      {/* renderRecentReviewsGrid() 함수 호출 */}
      {renderRecentReviewsGrid()}
      {recentReviews.length > 0 && allReviews.length > 0 && (
      <Button
        onClick={() => handleShowModal("xl")}
        style={{ backgroundColor: "#007bff", color: "#ffffff" }}
      >
        전체 리뷰 보기
      </Button>
)}
      {/* 전체 리뷰 모달 */}

      <Modal
        isOpen={showModal}
        onOpenChange={handleCloseModal}
        size={modalSize}
        placement="bottom"
      >
        <ModalContent
          style={{
            top: "10vh",
            maxHeight: "80vh",
            overflowY: "auto",
            maxWidth: "80vw",
            width: "80%",
          }}
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                전체 리뷰
              </ModalHeader>
              <ModalBody>
              {allReviews.length === 0 ? (
                <p>리뷰가 없습니다</p>
              ) : (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {allReviews.map((review) => (
                    <li key={review.id} style={{ marginBottom: "20px" }}>
                      <p>리뷰번호: {review.id}</p>
                      <p>회원명: {review.member}</p>
                      <p>
                        평점: {renderStars(review.rating)} ({review.rating})
                      </p>
                      <p>{review.body}</p>
                      <p>
                        편의시설: {renderStars(review.amenities)} (
                        {review.amenities})
                      </p>
                      <p>
                        서비스: {renderStars(review.staffService)} (
                        {review.staffService})
                      </p>
                      <p>
                        청결도: {renderStars(review.cleanliness)} (
                        {review.cleanliness})
                      </p>
                      {/* 삭제 버튼 추가 */}
                      <Button
                        onClick={() => handleDeleteReview(review.id)}
                        style={{ backgroundColor: "red", color: "white" }}
                      >
                        삭제
                      </Button>
                      {/* 다른 리뷰 정보 추가 */}
                    </li>
                  ))}
                </ul>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={onClose}
                  style={{ backgroundColor: "#007bff", color: "#ffffff" }}
                >
                  닫기
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ReviewList;
