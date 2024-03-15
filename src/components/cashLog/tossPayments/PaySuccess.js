"use client";

import { useTossPayments } from "@/hooks/CashLog/usePay";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { reserveIdState } from "@/store/reservationState";

export default function PaySuccess({ payment, reserveId }) {
  const router = useRouter();
  const setReserveId = useSetRecoilState(reserveIdState);

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
    setReserveId(null);
    router.push(`/cashLog/${cashLogId}/confirm`);
  }

  return;
}
