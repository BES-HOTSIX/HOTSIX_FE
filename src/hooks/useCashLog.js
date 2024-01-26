import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/config/axios-config";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/router";

/**  상세 정보 */
const fetchCashLogForPay = async (cashLogId) => {
  const res = await axios.get(`api/v1/cashLog/ForPay/${cashLogId}`);

  console.log("fetchCashForPay");

  return res.data;
};

export const useCashForPay = (cashLogId) => {
  const {
    data: cashLog,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["cashLogForPay", cashLogId],
    queryFn: () => fetchCashLogForPay(cashLogId),
  });

  console.log("cashLogId  = " + cashLogId);
  console.log("cashLog  = " + cashLog);

  return { cashLog, isLoading, isFetching, isError, error };
};

/**  결제하기 창 */
const fetchReservationForPay = async (reserveId) => {
  const res = await axios.get(`api/v1/cashLog/payByCash/${reserveId}`);

  console.log("fetchReservationForPay");

  return res.data;
};

export const useReservationForPay = (reserveId) => {
  console.log("????");

  const {
    data: reservation,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["reservationForPay", reserveId],
    queryFn: () => fetchReservationForPay(reserveId),
  });

  console.log("Payment reserverId =??? " + reserveId);

  return { reservation, isLoading, isFetching, isError, error };
};

// 포인트 결제를 위한 POST 요청
const fetchReserveForCashPayment = async (reserveId) => {
  return await axios.post(`/api/v1/cashLog/payByCash/${reserveId}`);
};

export const useReserveForCashPayment = () => {
  console.log("detected event");
  const queryClient = useQueryClient();
  const [cashLogConfirm, setCashLogConfirm] = useState(null);
  const {
    mutate: submitReservation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (reserveId) => {
      return fetchReserveForCashPayment(reserveId);
    },
    onSuccess: (res) => {
      console.log("포인트 결제 성공");
      console.log(res);

      if (!res.data.result) {
        toast.error("포인트 결제에 실패했습니다 🥲");
        return;
      }

      toast.success("포인트 결제가 완료되었습니다!");

      setCashLogConfirm(res);

      queryClient.invalidateQueries({ queryKey: ["reserve"] });
    },
    onError: (err) => {
      console.log("포인트 결제 실패");
      console.log(err);

      toast.error("포인트 결제에 실패했습니다 🥲");

      return err;
    },
  });

  console.log("cashLogConfirm = " + cashLogConfirm);

  return { submitReservation, cashLogConfirm, isPending, isError, error };
};