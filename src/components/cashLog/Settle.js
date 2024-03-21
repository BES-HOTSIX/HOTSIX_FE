"use client";

import { useMySettle, useMySettleList } from "@/hooks/CashLog/useSettle";
import {
  Button,
  Card,
  CardBody,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  select,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import SettleCalendar from "./SettleCalendar";
import { addMonths, format } from "date-fns";

export default function Settle() {
  function getNextWednesday() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (일요일)에서 6 (토요일) 사이의 값
    const daysUntilNextWednesday = (3 - dayOfWeek + 7) % 7 || 7; // 오늘이 수요일인 경우 다음 주 수요일을 계산
    const nextWednesday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + daysUntilNextWednesday
    );

    nextWednesday.setHours(0, 0, 0, 0);
    return nextWednesday;
  }

  const goReserveDetail = (e) => {
    const orderId = e.target.value;

    router.push(`${window.location.origin}/reserve/detail/${orderId}`);
  };

  const handleSelectionChange = (e) => {
    setSelectVal(e.target.value);
  };

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case "orderId":
        return (
          <Button onClick={goReserveDetail} value={item.orderId}>
            {item.orderId}
          </Button>
        );
      case "expectedAmount":
        return <div>{item.expectedAmount}</div>;
      case "price":
        return <div>{item.price}</div>;
      case "commission":
        return <div>{item.commission}</div>;
      case "settledAmount":
        return <div>{item.settledAmount}</div>;
      case "settleDue":
        return <div>{item.settleDue}</div>;
    }
  }, []);

  const defaultKw = "default";

  const settleKws = [
    { label: "기본", value: defaultKw },
    { label: "정산", value: "settled" },
    { label: "미정산", value: "unsettled" },
  ];

  const [selectVal, setSelectVal] = useState(defaultKw);

  const minDate = new Date(2024, 0, 1);

  const [date, setDate] = useState([minDate, getNextWednesday()]);

  const [start, end] = date;

  const formattedStart = format(start, "yyyy-MM-dd");
  const formattedEnd = format(end, "yyyy-MM-dd");

  const [page, setPage] = useState(1);
  const size = 10;

  const router = useRouter();

  const {
    mySettleList,
    isLoading: ListIsLoading,
    isFetching: ListIsFetching,
    isError: ListIsError,
    error: ListError,
  } = useMySettleList(page - 1, size, formattedStart, formattedEnd, selectVal);

  const { mySettle, isLoading, isFetching, isError, error } = useMySettle();

  if (isLoading || ListIsLoading) {
    return <div>loading</div>;
  }

  if (isError || ListIsError) {
    return <div>잘못된 접근입니다.</div>;
  }

  const mySettleData = mySettle.objData;
  const mySettleListData = mySettleList.objData;

  console.log(mySettle);

  console.log(mySettleList);

  const { content, totalPages } = mySettleListData;

  content.map((e) => {
    e.orderId = e.orderId.substring(0, 4);
  });

  return (
    <div>
      <div className="flex justify-around items-center grid-cols-3">
        <div className="text-3xl">정산 내역</div>
        <Card className="text-xl col-span-2 w-2/4 h-18">
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

      <div className="flex flex-row items-center justify-around h-16 w-full bg-gray-300 rounded-lg mt-5">
        <div className="text-lg">조회 기간</div>
        <SettleCalendar
          date={date}
          setDate={setDate}
          minDate={minDate}
          maxDate={getNextWednesday()}
        />
        <div></div>
        <div></div>
        <Select
          label="정산 여부"
          className="max-w-56"
          size="sm"
          selectedKeys={[selectVal]}
          onChange={handleSelectionChange}
        >
          {settleKws.map((settleKw) => (
            <SelectItem key={settleKw.value} value={settleKw.value}>
              {settleKw.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <Table
        className="mt-4"
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
        <TableHeader className="text-center">
          <TableColumn className="text-center" key="orderId">
            예약 ID
          </TableColumn>
          <TableColumn className="text-center" key="expectedAmount">
            총 정산금액
          </TableColumn>
          <TableColumn className="text-center" key="price">
            매출액
          </TableColumn>
          <TableColumn className="text-center" key="commission">
            수수료
          </TableColumn>
          <TableColumn className="text-center" key="settledAmount">
            실 지급액
          </TableColumn>
          <TableColumn className="text-center" key="settleDue">
            정산일
          </TableColumn>
        </TableHeader>
        <TableBody items={content}>
          {(item) => (
            <TableRow key={item}>
              {(columnKey) => (
                <TableCell className="text-center">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
