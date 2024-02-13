import React from "react";
import SampleComp from "../SampleComp";

export default function page({ params: { id } }) {
  return <SampleComp memberId={id} />;
}
