"use client";

import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";

const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);

export function CheckoutPage() {
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);
  const agreementWidgetRef = useRef(null);
  const [price, setPrice] = useState(1000);

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(
        "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm",
        ANONYMOUS
      ); // 비회원 customerKey

      if (paymentWidgetRef.current == null) {
        paymentWidgetRef.current = paymentWidget;
      }

      const paymentMethodsWidget =
        paymentWidgetRef.current.renderPaymentMethods(
          "#payment-method",
          { value: price },
          { variantKey: "DEFAULT" }
        );

      agreementWidgetRef.current = paymentWidgetRef.current.renderAgreement(
        "#agreement",
        { variantKey: "DEFAULT" }
      );

      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    })();
  }, []);

  return (
    <div className="wrapper w-100">
      <div className="max-w-540 w-100">
        <div id="payment-method" className="w-100" />
        <div id="agreement" className="w-100" />
        <div className="btn-wrapper w-100">
          <button
            className="btn primary w-100"
            onClick={async () => {
              const paymentWidget = paymentWidgetRef.current;

              try {
                /**
                 * 결제 요청
                 * @docs https://docs.tosspayments.com/reference/widget-sdk#requestpayment%EA%B2%B0%EC%A0%9C-%EC%A0%95%EB%B3%B4
                 */
                await paymentWidget?.requestPayment({
                  orderId: generateRandomString(),
                  orderName: "토스 티셔츠 외 2건",
                  customerName: "김토스",
                  customerEmail: "customer123@gmail.com",
                  successUrl:
                    window.location.origin +
                    "/sandbox/success" +
                    window.location.search,
                  failUrl:
                    window.location.origin +
                    "/sandbox/fail" +
                    window.location.search,
                });
              } catch (error) {
                // TODO: 에러  처리
              }
            }}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
