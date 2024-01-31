"use client";

import {
  useReservationForPay,
  useReserveForCashPayment,
} from "@/hooks/useCashLog";
import { Button, Card, CardBody, Image, Slider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CiImageOff } from "react-icons/ci";

export default function PayByCash({ reserveId }) {
  const router = useRouter();

  const {
    submitReservation,
    cashLogConfirm,
    isPending: submitIsPending,
    isError: submitIsError,
    error: submitError,
  } = useReserveForCashPayment();

  // TODO 이 부분 useEffect 활용해서 한번 해보기
  if (cashLogConfirm) {
    const cashLogId = cashLogConfirm.data.objData.cashLogId;

    router.push(`/cashLog/${cashLogId}/confirm`);
  }

  const goPayByCash = (e) => {
    e.preventDefault();

    submitReservation(reserveId);
  };

  const { reservation, isLoading, isError, error } =
    useReservationForPay(reserveId);

  if (isLoading) {
    return <div>loading</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const goBack = () => {
    router.back();
  };

  const reservationData = reservation.objData;

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

  console.log(reservation);

  return (
    <div>
      <div>
        <div className="flex justify-center mb-5" style={{ fontSize: "40px" }}>
          예약하기
        </div>
        <div className="flex justify-center mb-5">
          <Card
            isBlurred
            className="
        border-none 
        bg-background/60 
        dark:bg-default-100/50 
        w-[810px]
        "
            shadow="sm"
          >
            <CardBody>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                <div className="relative col-span-6 md:col-span-4">
                  <div>
                    {reservationData.hotelPhotoUrl ? (
                      <Image
                        alt="숙소 대표 이미지"
                        className="object-cover"
                        height={200}
                        shadow="md"
                        src={reservationData.hotelPhotoUrl}
                        width={200}
                      />
                    ) : (
                      <div className="absolute w-full h-full bg-base-200 inset-0 flex flex-col justify-center items-center text-gray-500 rounded-md">
                        <CiImageOff
                          className="object-cover"
                          height={200}
                          width={200}
                        />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col col-span-6 md:col-span-8">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0">
                      <h3 className="font-semibold text-2xl">예약 정보</h3>
                      <p className="text-large mt-1">
                        호텔 이름 : {reservationData.hotelNickname}
                      </p>
                      <p className="text-large mt-1">
                        체크인 : {formattedCheckInDate}
                      </p>
                      <p className="text-large mt-1">
                        체크아웃 : {formattedCheckOutDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex justify-center">
          <Card
            isBlurred
            className="
        border-none 
        bg-background/60 
        dark:bg-default-100/50 
        w-[810px]
        "
            shadow="sm"
          >
            <CardBody>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                <div className="relative col-span-6 md:col-span-4"></div>

                <div className="flex flex-col col-span-6 md:col-span-8">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0">
                      <h3 className="font-semibold text-2xl">결제 정보</h3>
                      <p className="text-large mt-1">
                        총 가격 : {reservationData.paidPrice}원
                      </p>
                      <p className="text-large mt-1">할인 금액 : 0원</p>
                      <p className="text-large mt-1">
                        결제 금액 : {reservationData.paidPrice}원
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="flex justify-center mt-5">
          <Button onClick={goBack} className="mr-20" color="default">
            뒤로가기
          </Button>
          <Button onClick={goPayByCash} color="primary">
            결제하기
          </Button>
        </div>
      </div>
    </div>
  );
}
