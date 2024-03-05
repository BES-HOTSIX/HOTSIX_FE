import RechargeSuccess from "@/components/cashLog/tossPayments/RechargeSuccess";
import React from "react";

export default function page({ searchParams }) {
  return <RechargeSuccess payment={searchParams} />;
}
