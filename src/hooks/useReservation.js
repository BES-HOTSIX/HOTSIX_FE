import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios-config";

/**  상세 정보 */
const fetchReservationDetail = async (reserveId) => {
  const res = await axios.get(`api/v1/reserve/detail/${reserveId}`);

<<<<<<< HEAD
  console.log("fetchReservationDetail");

  return res.data;
};
=======
	return res.data
}
>>>>>>> 104404cb4ece9e2bca1438e16abaf847f81743cb

export const useReservationDetail = (reserveId) => {
  const {
    data: reservation,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["reservationDetail", reserveId],
    queryFn: () => fetchReservationDetail(reserveId),
  });

  console.log("reserverId = " + reserveId);

  return { reservation, isLoading, isFetching, isError, error };
};
