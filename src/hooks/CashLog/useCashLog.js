import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "@/config/axios-config";

// 나의 캐시 사용 내역
const fetchMyCashLog = async ({ page, size }) => {
  const res = await axios.get(`api/v1/cashLog/me?page=${page}&size=${size}`, {
    ...axios.defaults,
    useAuth: true,
  });

  return res.data;
};

export const useMyCashLog = ({ page, size }) => {
  const {
    data: myCashLog,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["myCashLog", page, size],
    queryFn: () => fetchMyCashLog({ page, size }),
    retry: 0,
    placeholderData: keepPreviousData,
  });

  return { myCashLog, isLoading, isFetching, isError, error };
};

// 예약 완료창
const fetchCashLogForConfirm = async (cashLogId) => {
  const res = await axios.get(`api/v1/cashLog/${cashLogId}/confirm`, {
    ...axios.defaults,
    useAuth: true,
  });

  console.log("fetchCashLogForConfirm");

  return res.data;
};

export const useCashLogForConfirm = (cashLogId) => {
  const {
    data: cashLog,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["cashLogForConfirm", cashLogId],
    queryFn: () => fetchCashLogForConfirm(cashLogId),
  });

  console.log("cashLogId = " + cashLogId);

  return { cashLog, isLoading, isFetching, isError, error };
};
