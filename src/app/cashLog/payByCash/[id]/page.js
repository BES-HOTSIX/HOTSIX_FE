import PayByCash from "@/components/cashLog/PayByCash";
import React from "react";

export default function page({ params: { id } }) {
  return <PayByCash reserveId={id} />;
}
