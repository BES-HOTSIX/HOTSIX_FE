"use client";

import { useReserveForCancel } from "@/hooks/useCashLog";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function SampleComp({ reserveId }) {
  const { submitReserveForCancel, res, isPending, isError, error } =
    useReserveForCancel();

  const router = useRouter();

  if (res) {
    console.log(res);
  }

  if (res) {
    cashLogId = res.data.objData.cashLogId;
    router.push(`/cashLog/${cashLogId}/confirm`);
  }

  const run = async () => {
    console.log(reserveId);
    const id = reserveId;
    submitReserveForCancel(id);
  };

  return <Button onClick={run}>run</Button>;
}
