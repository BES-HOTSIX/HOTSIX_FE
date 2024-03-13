"use Client";

import { Card, CardBody } from "@nextui-org/react";
import React from "react";

export default function Settle() {
  return (
    <div>
      <div className="flex justify-around items-center grid-cols-3">
        <div className="text-3xl">정산 내역</div>
        <Card className="text-xl col-span-2 w-2/4 h-16">
          <CardBody className="flex flex-row items-center justify-around">
            <p>보유 캐시 :</p>
            <div>10000 원</div>
          </CardBody>
        </Card>
      </div>
      <div className="flex justify-around  mt-7 text-xl">
        <div>정산 예정일</div>
        <div> 2024-01-01 ~ 2024-01-08</div>
        <div> 정산 예정 금액</div>
        <div> 10000원</div>
      </div>
      <Card
        fullWidth="true"
        style={{ backgroundColor: "lightgray" }}
        className="h-16 mt-5"
      >
        <CardBody className="flex flex-row items-center gird-cols-6 justify-around text-xl">
          <div>조회 기간</div>
          <div className="col-span-2">2024-01-01</div>
          <div className="col-span-2">2024-02-01</div>
          <div></div>
          <div></div>
          <div>조회</div>
        </CardBody>
      </Card>
    </div>
  );
}
