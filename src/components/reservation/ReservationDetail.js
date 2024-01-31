"use client";

import React from "react";
import { useReservationDetail } from "@/hooks/useReservation";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import ReservationCancelDetail from "@/components/reservation/ReservationCancelDetail";

export default function ReservationDetail({ id }) {
  const { reservation, isLoading, isError, error } = useReservationDetail(id);

  const router = useRouter();

  const handleCancelClick = () => {
    const confirmCancel = window.confirm("예약을 취소하시겠습니까?");

    if (confirmCancel) {
      router.push("/your-destination-path");
    }
  };

  if (isLoading) {
    return <div>loading</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const reservationData = reservation.objData;

  // cancelDate가 null이 아닌 경우 ReservationCancelDetail 컴포넌트를 렌더링
  if (reservationData.cancelDate !== null) {
    return <ReservationCancelDetail id={id} />;
  }

  // createdAt 날짜 형식을 'nnnn.nn.nn' 형태로 포맷
  const formattedCreatedAt = new Date(reservationData.createdAt)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "")
    .split(" ")
    .join(".");

  // 예약 날짜 포맷 'nnnn.nn.nn ~ nnnn.nn.nn' 형태로 포맷
  const formattedCheckInDate = new Date(reservationData.checkInDate)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "")
    .split(" ")
    .join(".");
  const formattedCheckOutDate = new Date(reservationData.checkOutDate)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "")
    .split(" ")
    .join(".");

  // 현재 날짜와 체크인 날짜 비교해서 체크인 날짜가 오늘 날짜보다 하루 이상 남았는지 확인
  const today = new Date();
  const isCancellationAllowed =
    new Date(reservationData.checkInDate).getTime() - today.getTime() >
    24 * 60 * 60 * 1000;

  const staticImageUrl = "/tosspay.png";

	return (
		<div style={styles.container}>
			<div style={styles.contentSection}>
				<div style={styles.reservationSection}>
					<div style={styles.header}>
						<h1 style={styles.title}>예약 상세</h1>
						<span style={styles.date}>{formattedCreatedAt} 결제</span>
					</div>
					<div style={styles.hotelInfo}>
						<img
							src={reservationData.hotelPhotoUrl}
							alt="숙소 대표 이미지"
							style={styles.image}
						/>
						<div style={styles.hotelTextContainer}>
							<h2 style={styles.hotelName}>{reservationData.hotelNickname}</h2>
							<p style={styles.hotelDesc}>{reservationData.hotelDescription}</p>
							<p style={styles.hotelHost}>호스트 : {reservationData.hotelHost}</p>
						</div>
					</div>
					<div style={styles.reservationDetails}>
						<div style={styles.detailsRow}>
							<span>예약 날짜</span>
							<span>{`${formattedCheckInDate} ~ ${formattedCheckOutDate}`}</span>
						</div>
						<div style={styles.detailsRow}>
							<span>예약 인원</span>
							<span>{`${reservationData.numOfGuests} 명`}</span>
						</div>
					</div>
				</div>
				<div style={styles.divider}></div>
				<div style={styles.paymentSection}>
					<span style={styles.paymentTitle}>결제 정보</span>
					<div style={styles.paymentMethod}>
						<span style={styles.paymentMethodTitle}>결제 수단</span>
						<img
							src={staticImageUrl}
							alt="결제 수단 이미지"
							style={styles.paymentMethodImage}
						/>
					</div>
					<div style={styles.paymentInfo}>
						<div style={styles.detailsRow}>
							<span>결제 금액</span>
							<span>{`${reservationData.paidPrice}원`}</span>
						</div>
					</div>
					{isCancellationAllowed && (
						<div style={styles.actions}>
							<Button style={styles.button} onClick={handleCancelClick}>예약 취소</Button>
						</div>
					)}
					{!isCancellationAllowed && (
						<div style={styles.actions}>
							<Button style={styles.button} onClick={handleCancelClick}>리뷰 작성</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #eaeaea",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  contentSection: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "stretch",
  },
  reservationSection: {
    flex: 2,
    padding: "20px",
  },
  paymentSection: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  paymentTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  paymentMethod: {
    textAlign: "left",
    marginBottom: "20px",
  },
  paymentMethodTitle: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  paymentMethodImage: {
    width: "150px",
    height: "100px",
    border: "1px solid #eaeaea",
    borderRadius: "8px",
    objectFit: "cover", // 이미지가 컨테이너를 채우도록 설정
  },
  divider: {
    width: "1px",
    background: "#eaeaea",
    margin: "0 20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "1.5rem",
    margin: 0,
  },
  date: {
    fontSize: "0.9rem",
    color: "#666",
  },
  hotelInfo: {
    display: "flex",
    alignItems: "stretch",
    marginBottom: "30px",
  },
  image: {
    width: "200px",
    height: "200px",
    objectFit: "cover", // 이미지가 비율을 유지하며 컨테이너를 채우도록 설정
    marginRight: "20px",
    borderRadius: "8px", // 필요한 경우 이미지에 둥근 모서리를 적용
  },
  hotelTextContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
  hotelName: {
    flex: 1,
    marginBottom: "20px",
    fontWeight: "bold",
  },
  hotelDesc: {
    flex: 3,
    marginBottom: "20px",
    color: "#555",
  },
  hotelHost: {
    flex: 1,
  },
  reservationDetails: {
    marginBottom: "20px",
  },
  detailsRow: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  paymentInfo: {
    marginBottom: "20px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "#EF4444",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
