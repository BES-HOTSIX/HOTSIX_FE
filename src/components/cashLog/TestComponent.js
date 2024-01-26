"use client";
import { useCashDetail } from "@/hooks/useCashLog";

export default function TestComponent({ id }) {
  console.log(id);

  const { cashLog, isLoading, isError, error } = useCashDetail(id);

  const cashLogData = cashLog.objData;

  return (
    <div>
      <h1>{cashLogData.price}</h1>
    </div>
  );
}
