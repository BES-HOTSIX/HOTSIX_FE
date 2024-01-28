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

const ReviewList = () => {
  const [recentReviews, setRecentReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalSize, setModalSize] = useState("md");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/review/all"
        );
        setAllReviews(response.data);

        // 최근 5개 리뷰
        const recentReviewsData = response.data.slice(0, 5);
        setRecentReviews(recentReviewsData);
      } catch (error) {
        console.error("리뷰를 불러오는 중 에러 발생:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleShowModal = (size) => {
    setShowModal(true);
    setModalSize(size);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>최근 리뷰</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {recentReviews.map((review) => (
          <li
            key={review.id}
            style={{ marginBottom: "20px", textAlign: "center" }}
          >
            <p>회원명: {review.memberName}</p>
            <p>평점: {review.rating}</p>
            <p style={{ textAlign: "left" }}>{review.body}</p>
            <p>편의시설: {review.amenities}</p>
            <p>청결도: {review.cleanliness}</p>
            <p>서비스: {review.staffService}</p>
            {/* 다른 리뷰 정보 추가 */}
          </li>
        ))}
      </ul>

      <Button onClick={() => handleShowModal("2xl")}>전체 리뷰 보기</Button>

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
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {allReviews.map((review) => (
                    <li key={review.id} style={{ marginBottom: "20px" }}>
                      <p>회원명: {review.memberName}</p>
                      <p>평점: {review.rating}</p>
                      <p>{review.body}</p>
                      <p>편의시설: {review.amenities}</p>
                      <p>청결도: {review.cleanliness}</p>
                      <p>서비스: {review.staffService}</p>
                      {/* 다른 리뷰 정보 추가 */}
                    </li>
                  ))}
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>닫기</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ReviewList;
