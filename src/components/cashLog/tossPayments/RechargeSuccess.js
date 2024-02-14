"use client";

import { useTossPaymentsForRecharge } from "@/hooks/useCashLog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RechargeSuccess({ payment }) {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { submitTossPaymentsForRecharge, response, isPending, isError, error } =
    useTossPaymentsForRecharge();

  if (isPending) {
    return (
      <div> ✧*｡٩(ˊᗜˋ*)و✧*｡ ♡⸜(˶˃ ᵕ ˂˶)⸝♡ ✧*｡٩(ˊᗜˋ*)و✧*｡ ♡⸜(˶˃ ᵕ ˂˶)⸝♡</div>
    );
  }

  if (!isSubmitted) {
    submitTossPaymentsForRecharge(payment);
    setIsSubmitted(true);
    router.push(`/cashLog/me`);
  }

  return;
}
