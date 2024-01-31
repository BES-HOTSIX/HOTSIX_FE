"use client";

import { useTossPayments } from "@/hooks/useCashLog";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Success({ searchParams }) {
  const router = useRouter();
  console.log(searchParams);
  const { paymentKey, orderId, amount } = searchParams;
  console.log(paymentKey);

  const { submitTossPayments, isPending, isError, error } = useTossPayments();

  return (
    <main
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* <h1>결제 성공</h1>
      <p>주문: {payment.orderName}</p>
      <p>결제 수단: {payment.method}</p>
      <p>결제 금액: {payment.totalAmount.toLocaleString()}원</p>
      <p>
        결제 일시: {format(new Date(payment.approvedAt), "yyyy/MM/dd HH:mm:ss")}
      </p>
      <p>
        <a href={payment.receipt.url}>영수증</a>
      </p> */}
    </main>
  );
}
