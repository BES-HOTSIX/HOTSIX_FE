import CashLogMe from "@/components/cashLog/CashLogMe";
import React from "react";

export default function page({ searchParams }) {
  return <CashLogMe fail={searchParams} />;
}
