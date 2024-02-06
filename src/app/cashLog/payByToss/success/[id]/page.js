import Success from "@/components/cashLog/tossPayments/Success";
import React from "react";

export default function page({ searchParams, params: { id } }) {
  return <Success payment={searchParams} reserveId={id} />;
}
