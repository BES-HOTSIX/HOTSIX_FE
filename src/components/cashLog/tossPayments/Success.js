"use client";

import { useTossPayments } from "@/hooks/useCashLog";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Success({ payment }) {
  const router = useRouter();

  const { submitTossPayments, response, isPending, isError, error } =
    useTossPayments();

  const button = () => {
    console.log("before submitTossPayments");
    submitTossPayments(payment);
    console.log("after submitTossPayments");
  };

  return (
    <div>
      <button onClick={button}>ddd</button>
    </div>
  );
}
