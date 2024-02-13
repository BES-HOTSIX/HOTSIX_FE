"use client";

import { useTossPayments } from "@/hooks/useCashLog";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaySuccess({ payment, reserveId }) {
  const router = useRouter();

  const { submitTossPayments, response, isPending, isError, error } =
    useTossPayments();

  useEffect(() => {
    if (submitTossPayments) submitTossPayments({ payment, reserveId });
  }, [submitTossPayments]);

  if (isPending) {
    return (
      <div> ✧*｡٩(ˊᗜˋ*)و✧*｡ ♡⸜(˶˃ ᵕ ˂˶)⸝♡ ✧*｡٩(ˊᗜˋ*)و✧*｡ ♡⸜(˶˃ ᵕ ˂˶)⸝♡</div>
    );
  }

  if (response) {
    const cashLogId = response.data.objData.cashLogId;
    router.push(`/cashLog/${cashLogId}/confirm`);
  }

  return;
}
