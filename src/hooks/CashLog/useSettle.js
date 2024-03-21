import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "@/config/axios-config";
import { toast } from "react-toastify";
import { useState } from "react";

const fetchMySettle = async () => {
  const res = await axios.get(`api/v1/settle/me`, {
    ...axios.defaults,
    useAuth: true,
  });

  console.log(`fetchMySettle`);

  return res.data;
};

export const useMySettle = () => {
  const {
    data: mySettle,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryFn: () => fetchMySettle(),
  });

  console.log(`useMySettle`);

  return { mySettle, isLoading, isFetching, isError, error };
};

const fetchMySettleList = async (page, size, startDate, endDate, settleKw) => {
  const queryParams = new URLSearchParams({
    page,
    size,
    startDate,
    endDate,
    settleKw,
  }).toString();

  const res = await axios.get(`api/v1/settle/me/list?${queryParams}`, {
    ...axios.defaults,
    useAuth: true,
  });

  console.log(`fetchMySettleList`);

  return res.data;
};

export const useMySettleList = (page, size, startDate, endDate, settleKw) => {
  const {
    data: mySettleList,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["mySettleList", page, size, startDate, endDate, settleKw],
    queryFn: () => fetchMySettleList(page, size, startDate, endDate, settleKw),
    retry: 0,
    placeholderData: keepPreviousData,
  });

  return { mySettleList, isLoading, isFetching, isError, error };
};
