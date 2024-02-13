"use client";

import { useTossPaymentsForRecharge } from "@/hooks/useCashLog";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RechargeSuccess({ payment }) {
  const router = useRouter();

  const { submitTossPaymentsForRecharge, response, isPending, isError, error } =
    useTossPaymentsForRecharge();

  // useEffect(() => {
  //   if (submitTossPaymentsForRecharge) submitTossPaymentsForRecharge(payment);
  // }, [submitTossPaymentsForRecharge]);

  if (isPending) {
    return (
      <div> ✧*｡٩(ˊᗜˋ*)و✧*｡ ♡⸜(˶˃ ᵕ ˂˶)⸝♡ ✧*｡٩(ˊᗜˋ*)و✧*｡ ♡⸜(˶˃ ᵕ ˂˶)⸝♡</div>
    );
  }

  if (response) {
    router.push(`/cashLog/me`);
  }

  const goTry = () => {
    submitTossPaymentsForRecharge(payment);
  };

  return (
    <div>
      <Button onClick={goTry}>TRY</Button>
    </div>
  );
}
