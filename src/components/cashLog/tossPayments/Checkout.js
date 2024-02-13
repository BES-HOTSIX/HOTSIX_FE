import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useAsync } from "react-use";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "YbX2HuSlsC9uVJW6NMRMj";

export default function CheckOut({ price }) {
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);

  useAsync(async () => {
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
  }, []);

  const goTossPayments = async () => {
    const paymentWidget = paymentWidgetRef.current;

    await paymentWidget?.requestPayment({
      orderId: nanoid(),
      orderName: "토스 티셔츠 외 2건",
      customerName: "김토스",
      customerEmail: "customer123@gmail.com",
      successUrl: `${window.location.origin}/success`,
      failUrl: `${window.location.origin}/fail`,
    });
  };

  return (
    <main style={{ display: "flex", flexDirection: "column" }}>
      <h1>주문서</h1>
      <span>{`${price.toLocaleString()}원`}</span>
      <div></div>
      <div>
        <div id="payment-widget" />
        <div id="agreement"></div>
        <button onClick={goTossPayments}>결제하기</button>
      </div>
    </main>
  );
}
