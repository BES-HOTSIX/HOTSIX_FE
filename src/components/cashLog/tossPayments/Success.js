"use client";

import { useTossPayments } from "@/hooks/useCashLog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Success({ payment, reserveId }) {
  const router = useRouter();

  const { submitTossPayments, response, isLoading, isError, error } =
    useTossPayments();

  if (isLoading) {
    return (
      <div> ✧*｡٩(ˊᗜˋ*)و✧*｡ ♡⸜(˶˃ ᵕ ˂˶)⸝♡ ✧*｡٩(ˊᗜˋ*)و✧*｡ ♡⸜(˶˃ ᵕ ˂˶)⸝♡</div>
    );
  }

  if (response) {
    const cashLogId = response.data.objData.cashLogId;
    router.push(`/cashLog/${cashLogId}/confirm`);
  }

  const go = () => {
    submitTossPayments({ payment, reserveId });
  };
  // submitTossPayments({payment, reserveId })

  return (
    <div>
      <button onClick={go}>TRY</button>
      <h1></h1>
    </div>
  );
}
