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

const fetchMySettleList = async ({ page, size }) => {
  const res = await axios.get(
    `api/v1/settle/me/list?page=${page}&size=${size}`,
    {
      ...axios.defaults,
      useAuth: true,
    }
  );

  console.log(`fetchMySettleList`);

  return res.data;
};

export const useMySettleList = ({ page, size }) => {
  const {
    data: mySettleList,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["mySettleList", page, size],
    queryFn: () => fetchMySettleList({ page, size }),
    retry: 0,
    placeholderData: keepPreviousData,
  });

  return { mySettleList, isLoading, isFetching, isError, error };
};
