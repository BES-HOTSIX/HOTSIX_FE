import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/config/axios-config";
import { toast } from "react-toastify";
import { useState } from "react";

const fetchReserveForCancel = async (reserveId) => {
  return await axios.patch(
    `/api/v1/refund/reserve/${reserveId}`,
    {},
    {
      ...axios.defaults,
      useAuth: true,
    }
  );
};

export const useReserveForCancel = () => {
  const queryClient = useQueryClient();
  const [res, setRes] = useState(null);
  const {
    mutate: submitReserveForCancel,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (reserveId) => {
      return fetchReserveForCancel(reserveId);
    },
    onSuccess: (res) => {
      console.log("예약 취소 성공");

      if (!res.data.result) {
        toast.error("예약 취소에 실패했습니다 🥲");
        return;
      }

      toast.success("예약 취소가 완료되었습니다!");

      setRes(res);

      queryClient.invalidateQueries({ queryKey: ["reserve"] });
    },
    onError: (err) => {
      console.log("예약 취소 실패");

      toast.error("예약 취소에 실패했습니다 🥲");

      return err;
    },
  });

  return { submitReserveForCancel, res, isPending, isError, error };
};
