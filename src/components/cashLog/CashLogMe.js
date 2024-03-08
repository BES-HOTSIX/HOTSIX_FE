"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import {
  useCancelRecharge,
  useMyCashLog,
  useMyRecharge,
} from "@/hooks/useCashLog";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { useAsync } from "react-use";
import { nanoid } from "nanoid";

export default function CashLogMe({ fail }) {
  // 토스페이먼츠 관련 훅
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(500000);

  useAsync(async () => {
    if (isOpen) {
      const paymentWidget = await loadPaymentWidget(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
        process.env.NEXT_PUBLIC_TOSS_CUSTOMER_KEY
      );

      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        "#payment-widget",
        { value: price },
        { variantKey: "DEFAULT" }
      );

      paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

      paymentWidgetRef.current = paymentWidget;
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    }
  }, [isOpen]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  // 페이지네이션 관련
  const [cashLogPage, setCashLogPage] = useState(1);
  const cashLogPageSize = 5;
  const {
    myCashLog,
    isLoading: cashLogIsLoading,
    isError: cashLogIsError,
    error: cashLogError,
  } = useMyCashLog({
    page: cashLogPage - 1,
    size: cashLogPageSize,
  });

  const [rechargePage, setRechargePage] = useState(1);
  const rechargePageSize = 5;
  const {
    myRecharge,
    isLoading: rechargeIsLoading,
    isError: rechargeIsError,
    error: rechargeError,
  } = useMyRecharge({
    page: rechargePage - 1,
    size: rechargePageSize,
  });

  const { submitCancelRecharge, isPending, isError, error } =
    useCancelRecharge();

  const doCancel = async (orderId) => {
    console.log(`sumbitCancelRecharge`);
    submitCancelRecharge(orderId);
  };

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case "createdAt":
        return <div>{item.createdAt}</div>;
      case "orderId":
        return <div>{item.orderId}</div>;
      case "status":
        return <div>{item.status}</div>;
      case "virtualAccount":
        return <div>{item.virtualAccount}</div>;
      case "price":
        return <div>{item.price}</div>;
      case "cancel":
        if (item.status == "입금 완료" || item.status == "입금 취소")
          return (
            <Button isDisabled color="default" size="sm">
              취소하기
            </Button>
          );
        return (
          <Button
            color="danger"
            size="sm"
            onClick={() => doCancel(item.orderId)}
          >
            취소하기
          </Button>
        );
    }
  }, []);

  if (cashLogIsLoading || rechargeIsLoading) return <div></div>;

  if (!myCashLog || !myRecharge) return <div>잘못된 접근입니다</div>;

  console.log(myCashLog);
  console.log(myRecharge);

  const cashLogsData = myCashLog.objData;

  const username = cashLogsData.username;
  const restCash = cashLogsData.restCash;

  const { content: cashLogPages, totalPages: cashLogTotalPages } =
    cashLogsData.cashLogConfirmPage;

  const rechargeData = myRecharge.objData;

  const { content: rechargePages, totalPages: rechargeTotalPages } =
    rechargeData;

  console.log(cashLogPages);

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

  rechargePages.map((e) => {
    e.orderId = e.orderId.substring(0, 4);
  });

  const goTossPayments = async () => {
    const paymentWidget = paymentWidgetRef.current;

    // 테스트 환경에선 결제 스킵
    if (process.env.NEXT_PUBLIC_BASE_URL == "http://localhost:8080") {
      await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: "캐시 충전",
        customerName: username,
        customerEmail: `hagd0520@gmail.com`,
        successUrl: `${window.location.origin}/mypage/cashLog/success`,
        failUrl: `${window.location.origin}/mypage/cashLog/me`,
        _skipAuth: "FORCE_SUCCESS",
      });
    }

    await paymentWidget?.requestPayment({
      orderId: nanoid(),
      orderName: "캐시 충전",
      customerName: username,
      customerEmail: `hagd0520@gmail.com`,
      successUrl: `${window.location.origin}/mypage/cashLog/success`,
      failUrl: `${window.location.origin}/mypage/cashLog/me`,
    });
  };

  const cashHandler = (e) => {
    const newCash = e.target.value;

    if (!isNaN(newCash) && newCash != "0") setPrice(newCash);
  };

  return (
    <div>
      <div className="flex justify-between mb-5 items-center">
        <p className="text-4xl ml-10">결제 내역</p>
        <Card className="py-4 w-2/4 right-0 top-0">
          <CardBody className="overflow-visible py-2 flex flex-row justify-between">
            <p className="text-2xl">보유 캐시 : {restCash}</p>
            <Button onClick={onOpen} color="primary">
              충전하기
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      충전하기
                    </ModalHeader>
                    <ModalBody>
                      <div id="payment-widget" />
                      <div id="agreement" />
                      <div className="flex justify-around items-center">
                        <div>충전금액</div>
                        <Input
                          className="w-3/5"
                          value={price}
                          onChange={cashHandler}
                          placeholder={0}
                          endContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                ₩
                              </span>
                            </div>
                          }
                        />
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="light" onPress={onClose}>
                        취소하기
                      </Button>
                      <Button color="primary" onPress={goTossPayments}>
                        충전하기
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
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
              page={cashLogPage}
              total={cashLogTotalPages}
              onChange={(page) => setCashLogPage(page)}
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
