// src/components/review/ReviewList.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react'

const ReviewList = ({ hotelId }) => {
  const [recentReviews, setRecentReviews] = useState([])
  const [allReviews, setAllReviews] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalSize, setModalSize] = useState('md')

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/review/${hotelId}`
      )
      setAllReviews(response.data)

      // 최근 4개 리뷰
      const recentReviewsData = response.data.slice(0, 4)
      setRecentReviews(recentReviewsData)
    } catch (error) {
      console.error('리뷰를 불러오는 중 에러 발생:', error)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [hotelId])

  const handleShowModal = (size) => {
    setShowModal(true)
    setModalSize(size)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? 'gold' : 'lightgray',
          }}>
          ★
        </span>
      )
    }
    return stars
  }

  const handleDeleteReview = async (id) => {
    console.log('Review ID:', id)

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/review/delete/${id}`
      )
      console.log('리뷰가 성공적으로 삭제되었습니다.')
      // 삭제 후 리뷰 다시 로드
      fetchReviews()
      alert('리뷰가 성공적으로 삭제되었습니다.')
    } catch (error) {
      console.error('리뷰 삭제 중 오류 발생:', error)
      alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 최근 리뷰를 2x2 그리드로 렌더링
  const renderRecentReviewsGrid = () => {
    if (!Array.isArray(recentReviews) || recentReviews.length === 0) {
      return <p>등록된 리뷰가 없습니다.</p>
    }

    return recentReviews.map((review) => (
      <div key={review.id} style={{ flex: 1, padding: '10px' }}>
        <p>리뷰번호: {review.id}</p>
        <p>회원명: {review.member}</p>
        <p>
          평점: {renderStars(review.rating)} ({review.rating})
        </p>
        <p style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>
          {review.body}
        </p>
        <p>
          편의시설: {renderStars(review.amenities)} ({review.amenities})
        </p>
        <p>
          서비스: {renderStars(review.staffService)} ({review.staffService})
        </p>
        <p>
          청결도: {renderStars(review.cleanliness)} ({review.cleanliness})
        </p>
        <Button
          onClick={() => handleDeleteReview(review.id)}
          style={{ backgroundColor: 'red', color: 'white' }}>
          삭제
        </Button>
      </div>
    ))
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <h2>최근 리뷰</h2>
      {renderRecentReviewsGrid()}
      {recentReviews.length > 0 && allReviews.length > 0 && (
        <Button
          onClick={() => handleShowModal('xl')}
          style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
          전체 리뷰 보기
        </Button>
      )}
      <Modal
        isOpen={showModal}
        onOpenChange={handleCloseModal}
        size={modalSize}
        placement='bottom'>
        <ModalContent
          style={{
            top: '10vh',
            maxHeight: '80vh',
            overflowY: 'auto',
            maxWidth: '80vw',
            width: '80%',
          }}>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                전체 리뷰
              </ModalHeader>
              <ModalBody>
                {Array.isArray(allReviews) && allReviews.length > 0 ? (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {allReviews.map((review) => (
                      <li key={review.id} style={{ marginBottom: '20px' }}>
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
                        <Button
                          onClick={() => handleDeleteReview(review.id)}
                          style={{ backgroundColor: 'red', color: 'white' }}>
                          삭제
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>리뷰가 없습니다</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={onClose}
                  style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
                  닫기
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ReviewList
