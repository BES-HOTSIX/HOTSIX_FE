"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  Card,
  CardBody,
} from "@nextui-org/react";
import { useMyCashLog } from "@/hooks/useCashLog";

export default function CashLogMe() {
  const [page, setPage] = React.useState(1);
  const { myCashLog, isLoading, isError, error } = useMyCashLog(page - 1);

  if (isLoading) return <div></div>;

  if (!myCashLog) return <div>잘못된 접근입니다</div>;

  console.log(myCashLog);

  const cashLogsData = myCashLog.objData;

  const restCash = myCashLog.objData.restCash;

  const { content: cashLogPage, totalPages } = cashLogsData.cashLogConfirmPage;

  console.log(cashLogPage);

  cashLogPages.map((e) => {
    e.createdAt = new Date(e.createdAt)
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\./g, "")
      .split(" ")
      .join(".");
  });

  cashLogPages.map((e) => {
    e.orderId = e.orderId.substring(0, 4);
  });

  rechargePages.map((e) => {
    e.createdAt = new Date(e.createdAt)
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\./g, "")
      .split(" ")
      .join(".");
  });

  return (
    <div className="mt-32 min-h-screen">
      <div className="flex justify-between mb-5 items-center">
        <p className="text-4xl ml-10">결제 내역</p>
        <Card className="py-4 w-2/4 right-0 top-0">
          <CardBody className="overflow-visible py-2">
            <p className="text-2xl">보유 캐시 : {restCash}</p>
          </CardBody>
        </Card>
      </div>
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
              total={totalPages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="createdAt">날짜</TableColumn>
          <TableColumn key="cashLogId">식별번호</TableColumn>
          <TableColumn key="eventType">카테고리</TableColumn>
          <TableColumn key="price">금액</TableColumn>
        </TableHeader>
        <TableBody items={cashLogPages}>
          {(item) => (
            <TableRow key={item.cashLogId}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <p className="text-4xl ml-10 mt-5">충전 내역</p>
      <div className="mt-5">
        <Table
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={rechargePage}
                total={rechargeTotalPages}
                onChange={(page) => setRechargePage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="createdAt">날짜</TableColumn>
            <TableColumn key="orderId">주문코드</TableColumn>
            <TableColumn key="status">STATUS</TableColumn>
            <TableColumn key="virtualAccount">가상계좌번호</TableColumn>
            <TableColumn key="price">신청액</TableColumn>
            <TableColumn key="cancel"></TableColumn>
          </TableHeader>
          <TableBody items={rechargePages}>
            {(item) => (
              <TableRow key={item}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
