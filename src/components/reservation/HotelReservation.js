"use client";

import React, { useState, useEffect } from "react";
import { useHotelDetail } from "@/hooks/useHotel";
import { Button, Spacer, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import CalendarCustom from "./CalendarCustom";
import axios from "@/config/axios-config";
import { differenceInCalendarDays, addDays } from "date-fns";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { reserveIdState } from "@/store/reservationState";
import { FaCalendarCheck } from "react-icons/fa";

export default function HotelReservation({ id }) {
  const { hotel, isHotelLoading, isError, error } = useHotelDetail(id);
  const [guestCount, setGuestCount] = useState(1);
  const [reserveId, setReserveId] = useRecoilState(reserveIdState);

  // CalendarCustom에 props로 전달
  const [startDate, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [endDate, setEndDate] = useState(
    addDays(new Date(new Date().setHours(0, 0, 0, 0)), 1)
  );
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
    return <div className="h-[60vh] mt-32">loading</div>;
  }

  if (isError) {
    return <div className="h-[60vh] mt-32">Error: {error.message}</div>;
  }

  const mainImage = hotel.imagesResponse.imageUrl[0];
  const staticImageUrl = "/tosspay.png";

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
    const formattedStartDate = new Date(startDate)
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\./g, "")
      .split(" ")
      .join("-");
    const formattedEndDate = new Date(endDate)
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\./g, "")
      .split(" ")
      .join("-");

    const reservationInfo = {
      numOfGuests: guestCount,
      checkInDate: formattedStartDate,
      checkOutDate: formattedEndDate,
      price: calculatedPrice,
      isPaid: false,
    };

    try {
      if (reserveId) {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/reserve/${id}/${reserveId}`,
          reservationInfo,
          {
            ...axios.defaults,
            useAuth: true,
          }
        );

        console.log("PUT response: ", response);
        if (response.status >= 400) {
          throw new Error("Network response was not ok");
        }

        router.push(`/cashLog/payByCash/${reserveId}`);
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/reserve/${id}`,
          reservationInfo,
          {
            ...axios.defaults,
            useAuth: true,
          }
        );

        console.log("POST response: ", response);
        if (response.status >= 400) {
          throw new Error("Network response was not ok");
        }

        const newReserveId = response.data.objData.id;
        setReserveId(newReserveId);

        router.push(`/cashLog/payByCash/${newReserveId}`);
      }
    } catch (error) {
      console.error("Error making reservation:", error);
    }
  };

  return (
    <div className="mt-32">
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
              <label htmlFor="guestCount" style={styles.guestCountLabel}>
                인원 선택
              </label>
              <div style={styles.guestCount}>
                <Button
                  auto
                  flat
                  color="default"
                  onClick={() => handleGuestCountChange(-1)}
                  style={styles.guestCountButton}
                >
                  -
                </Button>
                <Input
                  readOnly
                  variant="bordered"
                  value={guestCount.toString()}
                  style={styles.guestCountNumber}
                />
                <Button
                  auto
                  flat
                  color="primary"
                  onClick={() => handleGuestCountChange(1)}
                  style={styles.guestCountButton}
                >
                  +
                </Button>
              </div>
            </div>
            <Spacer y={1} />

            <div style={styles.refundPolicy}>
              <h3>환불 정책</h3>
              <p style={styles.refundPolicyContent}>
                체크인 전날까지 예약 취소가 가능합니다.<br></br>
                예약 취소 시 결제 금액의 100% 환불됩니다.
              </p>
            </div>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.paymentSection}>
            <div style={styles.hotelInfo}>
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  position: "relative",
                }}
              >
                <Image
                  src={mainImage}
                  alt="숙소 대표 이미지"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
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
            <button
              onClick={handleSubmit}
              className=" w-full px-6 py-3 bg-red-500 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-red-600 transition duration-200 ease-in-out flex items-center justify-center"
            >
              <FaCalendarCheck className="mr-2" />
              예약하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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
    justifyContent: "space-between",
  },
  reservationSection: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignSelf: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    flex: 1,
  },
  guestCountContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    margin: "20px 0",
  },
  guestCountLabel: {
    marginBottom: "10px",
  },
  guestCount: {
    display: "flex",
    alignItems: "center",
  },
  guestCountButton: {
    margin: "0 10px",
  },
  guestCountNumber: {
    textAlign: "center",
  },
  refundPolicy: {
    margin: "20px 0",
  },
  refundPolicyContent: {
    fontSize: "0.85rem",
    color: "grey",
  },
  hotelInfo: {
    display: "flex",
    alignItems: "stretch",
    marginBottom: "40px",
    minHeight: "200px",
  },
  hotelTextContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
    margin: "0 20px",
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
  paymentSection: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignSelf: "flex-start",
  },
  paymentAmount: {
    marginBottom: "50px",
  },
  paymentAmountTitle: {
    marginBottom: "10px",
  },
  paymentDetails: {
    marginBottom: "50px",
  },
  paymentMethodTitle: {
    fontWeight: "bold",
    marginBottom: "10px",
  },
  paymentMethodImage: {
    width: "150px",
    height: "100px",
    border: "1px solid #eaeaea",
    borderRadius: "8px",
    objectFit: "cover", // 이미지가 컨테이너를 채우도록 설정
  },
  divider: {
    alignSelf: "stretch",
    width: "1px",
    background: "#eaeaea",
    margin: "0 20px",
  },
};
