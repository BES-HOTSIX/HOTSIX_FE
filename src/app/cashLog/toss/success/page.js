import Success from "@/components/cashLog/tossPayments/Success";
import React from "react";

export default function page({ searchParams }) {
  return <Success payment={searchParams} />;
}
