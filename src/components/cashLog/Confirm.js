"use client";

import { useCashLogForConfirm } from "@/hooks/useCashLog";
import { Button, Card, CardBody, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Confirm({ cashLogId }) {
  const router = useRouter();

  const { cashLog, isLoading, isError, error } =
    useCashLogForConfirm(cashLogId);

  if (isLoading) {
    return <div>loading</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const cashLogData = cashLog.objData;

  const goHome = () => {
    router.push("");
  };

  const payByCash = (e) => {
    e.preventDefault();
    router.push(`/reserve/detail/${cashLogData.reserveId}`);
  };

  // createdAt 날짜 형식을 'nnnn.nn.nn' 형태로 포맷
  const formattedCreatedAt = new Date(cashLogData.createdAt)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "")
    .split(" ")
    .join(".");

  // 예약 날짜 포맷 'nnnn.nn.nn ~ nnnn.nn.nn' 형태로 포맷
  const formattedCheckInDate = new Date(cashLogData.checkInDate)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "")
    .split(" ")
    .join(".");
  const formattedCheckOutDate = new Date(cashLogData.checkOutDate)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "")
    .split(" ")
    .join(".");

  console.log(cashLog);

  return (
    <div>
      <div>
        <div className="flex justify-center mb-5" style={{ fontSize: "20px" }}>
          예약이 완료되었습니다
          <br />
          예약번호 {cashLogData.reserveId}
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
                <div className="relative col-span-6 md:col-span-4"></div>

                <div className="flex flex-col col-span-6 md:col-span-8">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0">
                      <h3 className="font-semibold text-2xl">예약 정보</h3>
                      <p className="text-large mt-1">
                        호텔 이름 : {cashLogData.hotelNickname}
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
                        총 가격 : {cashLogData.price}원
                      </p>
                      <p className="text-large mt-1">할인 금액 : 0원</p>
                      <p className="text-large mt-1">
                        결제 금액 : {cashLogData.price}원
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="flex justify-center mt-5">
          <Button onClick={goHome} className="mr-20" color="default">
            홈
          </Button>
          <Button onClick={payByCash} color="primary">
            예약 내역
          </Button>
        </div>
      </div>
    </div>
  );
}
