"use client";

import { useReserveForCancel } from "@/hooks/useCashLog";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function SampleComp({ reserveId }) {
  // 훅
  const { submitReserveForCancel, res, isPending, isError, error } =
    useReserveForCancel();

  // res 테스트용 console.log
  if (res) {
    console.log(res);
  }

  // router
  const router = useRouter();
  if (res) {
    // res에서 cashLogId를 추출
    cashLogId = res.data.objData.cashLogId;
    router.push(`/cashLog/${cashLogId}/confirm`);
  }

  // 예약취소 버튼
  const run = async () => {
    console.log(reserveId);
    submitReserveForCancel(reserveId);
  };

  return <Button onClick={run}>run</Button>;
}
