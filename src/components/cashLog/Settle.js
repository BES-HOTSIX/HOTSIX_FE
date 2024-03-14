"use client";

import { useMySettle } from "@/hooks/CashLog/useSettle";
import {
  Card,
  CardBody,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";

export default function Settle() {
  const { mySettle, isLoading, isFetching, isError, error } = useMySettle();

  console.log(mySettle);

  const mySettleData = mySettle.objData;

  return (
    <div>
      <div className="flex justify-around items-center grid-cols-3">
        <div className="text-3xl">정산 내역</div>
        <Card className="text-xl col-span-2 w-2/4 h-16">
          <CardBody className="flex flex-row items-center justify-around">
            <p>보유 캐시 :</p>
            <div>{mySettleData.restCash} 원</div>
          </CardBody>
        </Card>
      </div>
      <div className="flex justify-around  mt-7 text-2xl">
        <div className="text-lg">다음 정산 예정일</div>
        <div>{mySettleData.settleDate}</div>
        <div className="text-lg"> 정산 예정 금액</div>
        <div>{mySettleData.expectedTotalSettleAmount} 원</div>
      </div>
      <Card
        fullWidth="true"
        style={{ backgroundColor: "lightgray" }}
        className="h-16 mt-5"
      >
        <CardBody className="flex flex-row items-center justify-around text-xl">
          <div className="text-lg">조회 기간</div>
          <div>2024-01-01</div>
          <div> ~ </div>
          <div>2024-02-01</div>
          <div></div>
          <div></div>
          <div>조회</div>
        </CardBody>
      </Card>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="name">NAME</TableColumn>
          <TableColumn key="role">ROLE</TableColumn>
          <TableColumn key="status">STATUS</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
