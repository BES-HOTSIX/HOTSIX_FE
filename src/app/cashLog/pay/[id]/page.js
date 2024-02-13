import Pay from "@/components/cashLog/Pay";
import React from "react";

export default function page({ searchParams, params: { id } }) {
  return <Pay fail={searchParams} reserveId={id} />;
}
