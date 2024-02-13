"use client";

import {
  useReservationForPay,
  useReserveForCashPayment,
} from "@/hooks/useCashLog";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { CiImageOff } from "react-icons/ci";
import { useAsync } from "react-use";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import Image from "next/image";

export default function Pay({ fail, reserveId }) {
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(null);
  const [payWithCash, setPayWithCash] = useState("");
  const [previousPayWithCash, setPreviousPayWithCash] = useState("");
  const [isChecked, setIsChecked] = useState(false);
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

      paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

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

  return (
    <div>
      <main style={{ display: "flex", flexDirection: "column" }}>
        <div className="flex justify-around items-center mt-4">
          <span className="w-1/4">{`보유 포인트 : ${reservationData.buyerRestCash}원`}</span>
          <div className="w-96">
            <div className="flex justify-between">
              <div>포인트 사용</div>
              <label htmlFor="coupon-box">
                <Checkbox
                  isSelected={isChecked}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setPreviousPayWithCash(payWithCash);
                      setPayWithCash(usableCash);
                      setPrice(paidPrice - usableCash);
                      setIsChecked(true);
                    }
                    if (!event.target.checked) {
                      setPayWithCash(previousPayWithCash);
                      setPrice(paidPrice - previousPayWithCash);
                      setIsChecked(false);
                    }
                  }}
                />
                <span>포인트 전부 쓰기</span>
              </label>
            </div>
            <Input
              value={payWithCash}
              onChange={cashHandler}
              placeholder={usableCash}
              labelPlacement="outside"
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">₩</span>
                </div>
              }
            />
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <Button onClick={goBack} className="mr-20" color="default">
            뒤로가기
          </Button>
          <Button onClick={goPay} color="primary">
            결제하기
          </Button>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  토스페이먼츠 결제
                </ModalHeader>
                <ModalBody>
                  <div id="payment-widget" className="mt-5" />
                  <div id="agreement"></div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    취소하기
                  </Button>
                  <Button color="primary" onPress={goTossPayments}>
                    결제하기
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </main>
    </div>
  );
}
