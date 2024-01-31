"use client";

import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useAsync } from "react-use";

const clientKey = "test_ck_GePWvyJnrKdN2eOm4wjO8gLzN97E";
const customerKey = "hagd0520hagd0520";

export default function Checkout() {
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(50_000);

  useAsync(async () => {
    // payment 프로미스
    const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: price },
      { variantKey: "DEFAULT" }
    );

    paymentWidgetRef.current = paymentWidget;
    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, []);

  // 할인이나 포인트 사용으로 가격 수정할 때 필요한 useEffect
  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  return (
    <main style={{ display: "flex", flexDirection: "column" }}>
      <h1>주문서주문서</h1>
      <span>{`${price.toLocaleString()}원`}</span>
      <div>
        <label>
          <input
            type="checkbox"
            onChange={(event) => {
              setPrice(event.target.checked ? price - 5_000 : price + 5_000);
            }}
          />
          5,000원 할인 쿠폰 적용
        </label>
      </div>
      <div id="payment-widget" />
      <button
        onClick={async () => {
          const paymentWidget = paymentWidgetRef.current;

          try {
            await paymentWidget?.requestPayment({
              orderId: nanoid(), // TODO reservation 아이디 + 생성날짜 로 ? 기입
              orderName: "토스 티셔츠 외 2건",
              customerName: "김토스",
              customerEmail: "customer123@gmail.com",
              successUrl: `${window.location.origin}/cashLog/toss/success`,
              // window.location.href,
              failUrl: `${window.location.origin}/fail`,
              _skipAuth: "FORCE_SUCCESS", // TODO 테스트용 설정
            });
          } catch (error) {
            // handle error
          }
        }}
      >
        결제하기
      </button>
    </main>
  );
}
