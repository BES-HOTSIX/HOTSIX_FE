"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SuccessPage() {
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    // const requestData = {
    //   orderId: query.orderId,
    //   amount: query.amount,
    //   paymentKey: query.paymentKey,
    // };

    async function confirm() {
      const response = await fetch("/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        router.push(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      // Implement your success logic here
    }

    confirm();
  }, [query]);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 성공</h2>
        <p>{`주문번호: 123414`}</p>
        <p>{`결제 금액: 50000원`}</p>
        <p>{`paymentKey: 12341414`}</p>
      </div>
    </div>
  );
}
