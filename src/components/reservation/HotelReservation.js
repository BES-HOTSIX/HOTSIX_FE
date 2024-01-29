'use client'

import React, { useState } from 'react';
import { useHotelDetail } from '@/hooks/useHotel';
import { Button, Spacer, Input, Select } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function HotelReservation({ id }) {
	const { hotel, isLoading, isError, error } = useHotelDetail(id)
	const [guestCount, setGuestCount] = useState(1);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(null);

	const handleDateChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
};

	const router = useRouter();

	if (isLoading) {
		return <div>loading</div>
	}
	
	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	const mainImage = hotel.imagesResponse.imageUrl[0]
	const staticImageUrl = '/tosspay.png';

	// Handle the guest count change
	const handleGuestCountChange = (delta) => {
		setGuestCount((prevCount) => {
			// 증가하는 경우, 최대 인원 수를 초과하지 않도록 확인
			if (delta > 0 && prevCount >= hotel.maxPeople) {
				return hotel.maxPeople;
			}

			// 감소하는 경우, 인원 수가 1 미만으로 내려가지 않도록 확인
			if (delta < 0 && prevCount <= 1) {
					return 1;
			}

			// 위 조건에 해당하지 않는 경우, 인원 수 변경
			return prevCount + delta;
		});
	};

	// Submit the reservation
	const handleSubmit = () => {
		// Implement submission logic here
		console.log(`Date: ${date}, Guest Count: ${guestCount}`);
		// router.push('/reservation/confirm');
	};

	return (
		<div style={styles.container}>
			<div style={styles.contentSection}>
				<div style={styles.reservationSection}>
					<h1 style={styles.title}>예약하기</h1>
					
					<label htmlFor="date">날짜 선택</label>
					<DatePicker
								selected={startDate}
								onChange={handleDateChange}
								startDate={startDate}
								endDate={endDate}
								selectsRange
								inline
						/>
					<Spacer y={1} />

					<div style={styles.guestCountContainer}>
						<label htmlFor="guestCount" style={styles.guestCountLabel}>인원 선택</label>
						<div style={styles.guestCount}>
							<Button auto flat color="error" onClick={() => handleGuestCountChange(-1)} style={styles.guestCountButton}>
								-
							</Button>
							<Input readOnly value={guestCount.toString()} style={styles.guestCountNumber}/>
							<Button auto flat color="success" onClick={() => handleGuestCountChange(1)} style={styles.guestCountButton}>
								+
							</Button>
						</div>
					</div>
					<Spacer y={1} />

					<h3>환불 정책</h3>
					<p>...환불 정책 내용...</p>
				</div>

				<div style={styles.divider}></div>

				<div style={styles.paymentSection}>
					<div style={styles.hotelInfo}>
						<img src={mainImage} alt="숙소 대표 이미지" style={styles.image} />
						<div style={styles.hotelTextContainer}>
							<h3 style={styles.hotelName}>호텔 타이틀 {hotel.hotelNickname}</h3>
							<p style={styles.hotelDesc}>호텔 설명 {hotel.hotelDescription}</p>
						</div>
					</div>
					
					<div style={styles.paymentDetails}>
						<h3 style={styles.paymentMethodTitle}>결제 수단</h3>
						<img
							src={staticImageUrl}
							alt="결제 수단 이미지"
							style={styles.paymentMethodImage}
						/>
					</div>
					<div style={styles.actions}>
						<Button style={styles.button} onClick={handleSubmit}>예약하기</Button>
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
		justifyContent: 'space-between',
	},
	reservationSection: {
		flex: 1,
		padding: '20px',
		display: 'flex',
		flexDirection: 'column',
		alignSelf: 'flex-start',
	},
	title: {
		fontSize: '1.5rem',
		fontWeight: 'bold',
		marginBottom: '20px',
		flex: 1,
	},
	dateInput: {
		width: '100%',
		padding: '10px',
		marginBottom: '10px',
		border: '1px solid #ddd',
		borderRadius: '4px',
	},
	guestCountContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		marginBottom: '20px',
	},
	guestCountLabel: {
		marginBottom: '10px',
	},
	guestCount: {
		display: 'flex',
		alignItems: 'center',
	},
	guestCountButton: {
		margin: '0 10px'
	},
	guestCountNumber: {
		textAlign: 'center',
	},
	hotelInfo: {
		display: 'flex',
		alignItems: 'stretch',
		marginBottom: '40px',
	},
	image: {
		width: '200px',
		height: '200px',
		objectFit: 'cover',
		marginRight: '20px',
		borderRadius: '8px',
	},
	hotelTextContainer: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
	},
	hotelName: {
		flex: 1,
		margin: '20px 0',
		fontWeight: 'bold',
	},
	hotelDesc: {
		flex: 2,
		marginBottom: '20px',
		color: '#555',
	},
	paymentSection: {
		flex: 1,
		padding: '20px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignSelf: 'flex-start',
	},
	paymentDetails: {
		marginBottom: '40px',
	},
	paymentMethodTitle: {
		fontWeight: 'bold',
		marginBottom: '10px',
	},
	paymentMethodImage: {
		width: '150px',
		height: '100px',
		border: '1px solid #eaeaea',
		borderRadius: '8px',
		objectFit: 'cover', // 이미지가 컨테이너를 채우도록 설정
	},
	actions: {
		display: 'flex',
		alignSelf: 'flex-start',
	},
	button: {
		padding: '10px 20px',
		backgroundColor: '#EF4444',
		color: 'white',
		borderRadius: '5px',
		cursor: 'pointer',
	},
	divider: {
		alignSelf: 'stretch',
		width: '1px',
		background: '#eaeaea',
		margin: '0 20px',
	},
};