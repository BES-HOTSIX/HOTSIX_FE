'use client'

import React from 'react'
import { useReservationDetail } from '@/hooks/useReservation'
import { Button } from '@nextui-org/react'

export default function ReservationDetail({ id }) {
	console.log(id)

	const { reservation, isLoading, isError, error } = useReservationDetail(id)

	if (isLoading) {
		return <div>loading</div>
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	const reservationData = reservation.objData
	
	// createdAt 날짜 형식을 'nnnn.nn.nn' 형태로 포맷
	const formattedCreatedAt = new Date(reservationData.createdAt).toLocaleDateString('ko-KR').replace(/\./g, '').split(' ').join('.');

	// 예약 날짜 포맷 'nnnn.nn.nn ~ nnnn.nn.nn' 형태로 포맷
	const formattedCheckInDate = new Date(reservationData.checkInDate).toLocaleDateString('ko-KR').replace(/\./g, '').split(' ').join('.');
	const formattedCheckOutDate = new Date(reservationData.checkOutDate).toLocaleDateString('ko-KR').replace(/\./g, '').split(' ').join('.');
	
	return (
		<div style={styles.container}>
			<div style={styles.contentSection}>
				<div style={styles.reservationSection}>
					<div style={styles.header}>
						<h1 style={styles.title}>예약 상세</h1>
						<span style={styles.date}>{formattedCreatedAt}</span>
					</div>
					<div style={styles.hotelInfo}>
						<div style={styles.imagePlaceholder}>숙소 대표 이미지 자리</div>
						<div>
							<h2 style={styles.hotelName}>{reservationData.hotelNickname}</h2>
							<p style={styles.hotelDesc}>{reservationData.hotelDescription}</p>
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
					<span style={styles.paymentTitle}>결제 상세</span>
					<div style={styles.paymentMethod}>
						<span style={styles.paymentMethodTitle}>결제 수단</span>
						<div style={styles.paymentMethodBox}></div>
					</div>					<div style={styles.paymentInfo}>
						<div style={styles.detailsRow}>
							<span>결제 금액</span>
							<span>{`${reservationData.paidPrice}원`}</span>
						</div>
					</div>
					<div style={styles.actions}>
						<Button style={styles.button}>예약 취소</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

const styles = {
	container: {
		maxWidth: '1000px',
		margin: 'auto',
		padding: '20px',
		display: 'flex',
		flexDirection: 'column',
		border: '1px solid #eaeaea',
		borderRadius: '8px',
		boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
	},
	contentSection: {
		display: 'flex',
		justifyContent: 'space-around',
	},
	reservationSection: {
		flex: 2,
		padding: '20px'
	},
	paymentSection: {
		flex: 1,
		padding: '20px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'flex-start'
	},
	paymentTitle: {
		fontSize: '1rem',
		fontWeight: 'bold',
		marginBottom: '10px',
	},
	paymentMethod: {
		textAlign: 'left',
		marginBottom: '20px',
	},
	paymentMethodTitle: {
		display: 'block',
		fontWeight: 'bold',
		marginBottom: '5px',
	},
	paymentMethodBox: {
		width: '100%', // or fixed width like '200px'
		height: '50px', // or fixed height like '50px'
		border: '1px solid #eaeaea',
		borderRadius: '8px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		// Placeholder content, replace with actual content as needed
		content: "'선택된 결제 방법'", 
	},
	divider: {
		width: '1px',
		background: '#eaeaea',
		margin: '0 20px',
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '20px',
	},
	title: {
		margin: 0,
	},
	date: {
		fontSize: '0.9rem',
		color: '#666',
	},
	hotelInfo: {
		display: 'flex',
		marginBottom: '20px',
	},
	imagePlaceholder: {
		width: '200px',
		height: '200px',
		backgroundColor: '#f0f0f0',
		marginRight: '20px',
	},
	hotelName: {
		margin: '0 0 10px 0',
		fontWeight: 'bold',
	},
	hotelDesc: {
		margin: '0',
		color: '#555',
	},
	reservationDetails: {
		marginBottom: '20px',
	},
	detailsRow: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		marginBottom: '10px',
	},
	paymentInfo: {
		marginBottom: '20px',
	},
	actions: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	button: {
		padding: '10px 15px',
		backgroundColor: '#0070f3',
		color: 'white',
		borderRadius: '5px',
		cursor: 'pointer',
	},
}