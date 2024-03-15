import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/config/axios-config";
import { toast } from "react-toastify";
import { useState } from "react";

// 포인트 결제를 위한 POST 요청
const fetchReserveForCashPayment = async (reserveId) => {
  return await axios.post(`/api/v1/pay/${reserveId}/byCash`);
};

export const useReserveForCashPayment = () => {
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

      toast.error("포인트 결제에 실패했습니다 🥲");

      return err;
    },
  });

  return { submitReservation, cashLogConfirm, isPending, isError, error };
};

/**  결제하기 창 */
const fetchReservationForPay = async (reserveId) => {
  const res = await axios.get(`api/v1/pay/${reserveId}`, {
    ...axios.defaults,
    useAuth: true,
  });

  return res.data;
};

export const useReservationForPay = (reserveId) => {
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

  return { reservation, isLoading, isFetching, isError, error };
};

// TossPayments post 요청
const fetchTossPayments = async ({ payment, reserveId }) => {
  console.log(reserveId);
  return await axios.post(`/api/v1/pay/${reserveId}/byToss`, payment);
};

export const useTossPayments = () => {
  const queryClient = useQueryClient();
  const [response, setResponse] = useState(null);
  const {
    mutate: submitTossPayments,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: ({ payment, reserveId }) => {
      return fetchTossPayments({ payment, reserveId });
    },
    onSuccess: (res) => {
      console.log("토스페이먼트 결제 성공");

      if (!res.data.result) {
        toast.error("토스페이먼트 결제에 실패했습니다 🥲");
        return;
      }

      setResponse(res);

      toast.success("토스페이먼트 결제가 완료되었습니다!");

      queryClient.invalidateQueries({ queryKey: ["tossPayments"] });
    },
    onError: (err) => {
      console.log("토스페이먼트 결제 실패");

      toast.error("토스페이먼트 결제에 실패했습니다 🥲");

      return err;
    },
  });

  return { submitTossPayments, response, isPending, isError, error };
};
