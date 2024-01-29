import Confirm from "@/components/cashLog/Confirm";
import React from "react";

export default function page({ params: { id } }) {
  return <Confirm cashLogId={id} />;
}
