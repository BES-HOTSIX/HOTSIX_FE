import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios-config";

/**  상세 정보 */
const fetchCashLogDetail = async (cashLogId) => {
  const res = await axios.get(`api/v1/cashLog/detail/${cashLogId}`);

  console.log("fetchCashDetail");

  return res.data;
};

export const useCashDetail = (cashLogId) => {
  const {
    data: cashLog,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["cashLogDetail", cashLogId],
    queryFn: () => fetchCashLogDetail(cashLogId),
  });

  console.log("cashLogId  = " + cashLogId);
  console.log("cashLog  = " + cashLog);

  return { cashLog, isLoading, isFetching, isError, error };
};
