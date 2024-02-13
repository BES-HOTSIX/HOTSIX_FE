"use client";

import { useReserveForCancel } from "@/hooks/useCashLog";
import { Button, useDisclosure } from "@nextui-org/react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useAsync } from "react-use";

export default function SampleComp({ memberId }) {
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(null);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // 리렌더링되더라도 실패 사유는 한번만 뜨게 하기 위한 useState
  const [isToasted, setIsToasted] = useState(false);
  console.log(isToasted);

  useAsync(async () => {
    if (isOpen) {
      const paymentWidget = await loadPaymentWidget(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
        process.env.NEXT_PUBLIC_TOSS_CUSTOMER_KEY
      );

      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        "#payment-widget",
        { value: price },
        { variantKey: "DEFAULT" }
      );

      paymentWidgetRef.current = paymentWidget;
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    }
  }, [isOpen]);

  // 할인이나 포인트 사용으로 가격 수정할 때 필요한 useEffect
  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  // 토스페이먼트 외 로직
  const {
    submitReservation,
    cashLogConfirm,
    isPending: submitIsPending,
    isError: submitIsError,
    error: submitError,
  } = useReserveForCashPayment();

  const { reservation, isLoading, isError, error } =
    useReservationForPay(reserveId);

  useEffect(() => {
    if (reservation) setPrice(reservation.objData.paidPrice);
  }, [reservation]);

  if (isLoading) {
    return <div>loading</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const reservationData = reservation.objData;
  const paidPrice = reservationData.paidPrice;
  const restCash = reservationData.buyerRestCash;
  const usableCash = paidPrice < restCash ? paidPrice : restCash;

  const goPay = async (e) => {
    e.preventDefault();

    // 사용하는 캐시가 price와 같을 경우 포인트 결제
    if (price == 0) submitReservation(reserveId);

    if (price != 0) onOpen();
  };

  const goTossPayments = async () => {
    const paymentWidget = paymentWidgetRef.current;

    try {
      await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: `${reservationData.hotelNickname}`,
        customerEmail: `hagd0520@gmail.com`, // TODO Member 값에 이메일도 있다면 여기에 입력해주자
        customerName: `${reservationData.buyerName}`,
        successUrl: `${window.location.origin}/cashLog/payByToss/success/${reserveId}`,
        failUrl: `${window.location.origin}/cashLog/payByCash/${reserveId}`,
        _skipAuth: "FORCE_SUCCESS",
      });
    } catch (error) {}
  };

  // goPay에서 만약 submitReservation이 호출될 경우 결제 확인 페이지로 이동
  if (cashLogConfirm) {
    const cashLogId = cashLogConfirm.data.objData.cashLogId;

    router.push(`/cashLog/${cashLogId}/confirm`);
  }

  const goBack = async () => {
    router.back();
  };

  if (!isToasted && fail.message) {
    toast.error(`토스페이먼츠 결제에 실패하였습니다. 사유 : ${fail.message}`);
    setIsToasted(true);
  }

  const run = async () => {};

  return <Button onClick={run}>run</Button>;
}
