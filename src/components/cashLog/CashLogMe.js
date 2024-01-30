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
} from "@nextui-org/react";
import { useMyCashLog } from "@/hooks/useCashLog";

export default function CashLogMe() {
  const [page, setPage] = React.useState(1);
  const { myCashLog, isLoading, isError, error } = useMyCashLog(page - 1);

  if (isLoading) return <div></div>;

  if (!myCashLog) return <div>잘못된 접근입니다</div>;

  console.log(myCashLog);

  const cashLogsData = myCashLog.objData;

  const cashLogs = cashLogsData.content;

  console.log(cashLogs); //

  const totalPages = cashLogsData.totalPages;

  return (
    <Table
      aria-label="Example table with client side pagination"
      bottomContent={
        <div className="flex w-full h-10 justify-center">
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
        <TableColumn key="eventType">카테고리</TableColumn>
        <TableColumn key="price">금액</TableColumn>
        <TableColumn key="cashLogId">식별번호</TableColumn>
      </TableHeader>
      <TableBody items={cashLogs}>
        {(cashLog) => (
          <TableRow key={cashLog.cashLogId}>
            {(columnKey) => (
              <TableCell>{getKeyValue(cashLog, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
