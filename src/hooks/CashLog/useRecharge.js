import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "@/config/axios-config";
import { toast } from "react-toastify";
import { useState } from "react";

// 나의 충전 신청 내역
const fetchMyRecharge = async ({ page, size }) => {
  const res = await axios.get(`api/v1/recharge/me?page=${page}&size=${size}`, {
    ...axios.defaults,
    useAuth: true,
  });

  return res.data;
};

export const useMyRecharge = ({ page, size }) => {
  const {
    data: myRecharge,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["myRecharge", page, size],
    queryFn: () => fetchMyRecharge({ page, size }),
    retry: 0,
    placeholderData: keepPreviousData,
  });

  return { myRecharge, isLoading, isFetching, isError, error };
};

// 충전 신청 취소
const fetchCancelRecharge = async (orderId) => {
  return await axios.patch(
    `/api/v1/recharge/${orderId}/cancel`,
    {},
    {
      ...axios.defaults,
      useAuth: true,
    }
  );
};

export const useCancelRecharge = () => {
  const queryClient = useQueryClient();
  const {
    mutate: submitCancelRecharge,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (orderId) => {
      return fetchCancelRecharge(orderId);
    },
    onSuccess: (res) => {
      console.log("충전 신청 취소 성공");

      if (!res.data.result) {
        toast.error("충전 신청 취소에 실패했습니다 🥲");
        return;
      }

      toast.success("충전 신청 취소가 완료되었습니다");

      queryClient.invalidateQueries({ queryKey: ["myRecharge"] });
    },
    onError: (err) => {
      console.log("충전 신청 취소 실패");

      console.log(`#####################`);
      console.log(err);

      toast.error("충전 신청 취소에 실패했습니다 🥲");

      return err;
    },
  });

  return { submitCancelRecharge, isPending, isError, error };
};

// 충전 신청
const fetchTossPaymentsForRecharge = async (payment) => {
  return await axios.post(`/api/v1/recharge/request`, payment, {
    ...axios.defaults,
    useAuth: true,
  });
};

export const useTossPaymentsForRecharge = () => {
  const queryClient = useQueryClient();
  const [res, setRes] = useState(null);
  const {
    mutate: submitTossPaymentsForRecharge,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (payment) => {
      console.log(payment);
      return fetchTossPaymentsForRecharge(payment);
    },
    onSuccess: (res) => {
      console.log("충전 신청 성공");

      console.log(res);

      if (!res.data.result) {
        toast.error("충전 신청에 실패했습니다 🥲");
        return;
      }

      toast.success("충전 신청이 완료되었습니다.");

      setRes(res);

      queryClient.invalidateQueries({ queryKey: ["myRecharge"] });
      queryClient.invalidateQueries({ queryKey: ["myCashLog"] });
    },
    onError: (err) => {
      console.log("충전 신청 실패");

      console.log(err);

      toast.error("충전 신청에 실패했습니다 🥲");

      return err;
    },
  });

  return {
    submitTossPaymentsForRecharge,
    response: res,
    isPending,
    isError,
    error,
  };
};
