'use client'

import React, { useState, useEffect } from 'react';
import { useHotelDetail } from '@/hooks/useHotel';
import { Button, Spacer, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import 'react-datepicker/dist/react-datepicker.css';
// import CalendarCustom from './Calendar';
import CalendarCustom from './CalendarCustom';
import axios from '@/config/axios-config'
import { differenceInCalendarDays, addDays } from 'date-fns';

export default function HotelReservation({ id }) {
	const { hotel, isHotelLoading, isError, error } = useHotelDetail(id);
	const [guestCount, setGuestCount] = useState(1);

	// CalendarCustom에 props로 전달
	const [startDate, setStartDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
	const [endDate, setEndDate] = useState(addDays(new Date(new Date().setHours(0, 0, 0, 0)), 1));
	const [totalPrice, setTotalPrice] = useState(0); // 가격 상태 추가

	const router = useRouter();
	
	useEffect(() => {
		// 호텔 정보가 로딩된 후에 가격 계산
		if (!isHotelLoading && hotel) {
				const daysDiff = differenceInCalendarDays(endDate, startDate) || 1; // 최소 1일은 계산
				const calculatedPrice = daysDiff * hotel.price;
				setTotalPrice(calculatedPrice);
		}
	}, [startDate, endDate, hotel, isHotelLoading]);

	if (isHotelLoading) {
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
	const handleSubmit = async () => {
		// 날짜 차이 계산
		const daysDiff = differenceInCalendarDays(endDate, startDate);

		// 호텔 가격 계산
		const calculatedPrice = daysDiff * hotel.price;

		// 시작 날짜와 종료 날짜 설정
		const formattedStartDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000)).toISOString().substring(0, 10);
		const formattedEndDate = new Date(endDate.getTime() + (24 * 60 * 60 * 1000)).toISOString().substring(0, 10);

		const reservationInfo = {
			numOfGuests: guestCount,
			checkInDate: formattedStartDate,
			checkOutDate: formattedEndDate,
			price: calculatedPrice,
			isPaid: false
		};
		console.log(reservationInfo);
	
		try {
			const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/reserve/${id}`, reservationInfo, {
				...axios.defaults,
				useAuth: true,
			});

			console.log('response: ', response);
			if (response.status >= 400) {
				throw new Error('Network response was not ok');
			}

			// Redirect or show success message
			const reserveId = response.data.objData.id;
			router.push(`/cashLog/payByCash/${reserveId}`);
		} catch (error) {
			console.error('Error making reservation:', error);
		}
	};

	return (
		<div style={styles.container}>
			<div style={styles.contentSection}>
				<div style={styles.reservationSection}>
					<h1 style={styles.title}>예약하기</h1>
					
					<label htmlFor="date">날짜 선택</label>
					<CalendarCustom
						hotelId={id}
						startDate={startDate}
						endDate={endDate}
						setStartDate={setStartDate}
						setEndDate={setEndDate}
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

					<div style={styles.refundPolicy}>
						<h3>환불 정책</h3>
						<p>...환불 정책 내용...</p>
					</div>
				</div>

				<div style={styles.divider}></div>

				<div style={styles.paymentSection}>
					<div style={styles.hotelInfo}>
						<img src={mainImage} alt="숙소 대표 이미지" style={styles.image} />
						<div style={styles.hotelTextContainer}>
							<h3 style={styles.hotelName}>{hotel.nickname}</h3>
							<p style={styles.hotelDesc}>{hotel.description}</p>
							<p style={styles.hotelHost}>호스트 : {hotel.host}</p>
						</div>
					</div>

					<div style={styles.paymentAmount}>
						<h3 style={styles.paymentAmountTitle}>결제 금액</h3>
						<p style={styles.paymentAmountValue}>{totalPrice}원</p>
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
		justifyContent: 'space-between',
	},
	title: {
		fontSize: '1.5rem',
		fontWeight: 'bold',
		marginBottom: '20px',
		flex: 1,
	},
	guestCountContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		margin: '20px 0',
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
	refundPolicy: {
		margin: '20px 0',
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
		justifyContent: 'space-between',
		flex: 1,
	},
	hotelName: {
		flex: 1,
		marginBottom: '20px',
		fontWeight: 'bold',
	},
	hotelDesc: {
		flex: 3,
		marginBottom: '20px',
		color: '#555',
	},
	hotelHost: {
		flex: 1,
	},
	paymentSection: {
		flex: 1,
		padding: '20px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignSelf: 'flex-start',
	},
	paymentAmount: {
		marginBottom: '40px',
	},
	paymentAmountTitle: {
		marginBottom: '10px',
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