"use client";

import { useMySettle, useMySettleList } from "@/hooks/CashLog/useSettle";
import {
  Button,
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
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

export default function Settle() {
  const [page, setPage] = useState(1);
  const size = 10;

  const router = useRouter();
  const { mySettle, isLoading, isFetching, isError, error } = useMySettle();
  const {
    mySettleList,
    isLoading: ListIsLoading,
    isFetching: ListIsFetching,
    isError: ListIsError,
    error: ListError,
  } = useMySettleList({ page: page - 1, size });

  const goReserveDetail = (e) => {
    const orderId = e.target.value;

    router.push(`${window.location.origin}/reserve/detail/${orderId}`);
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

  if (isLoading || ListIsLoading) {
    return <div>loading</div>;
  }

  if (isError || ListIsError) {
    return <div>잘못된 접근입니다.</div>;
  }

  console.log(mySettle);

  console.log(mySettleList);

  const mySettleData = mySettle.objData;
  const mySettleListData = mySettleList.objData;

  const { content, totalPages } = mySettleListData;

  content.map((e) => {
    e.orderId = e.orderId.substring(0, 4);
  });

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
        className="mt-6"
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
