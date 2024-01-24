import { useQuery } from "@tanstack/react-query"
import axios from '@/config/axios-config'

/**  상세 정보 */
const fetchReservationDetail = async (reserveId) => {
	const res = await axios.get(`api/v1/reserve/detail/${reserveId}`)

	console.log('fetchReservationDetail')

	return res.data
}

export const useReservationDetail = (reserveId) => {
	const {
		data: reservation,
		isLoading,
		isFetching,
		isError,
		error,
	} = useQuery({
		queryKey: ['reservationDetail', reserveId],
		queryFn: () => fetchReservationDetail(reserveId),
	})

	return { reservation, isLoading, isFetching, isError, error }
}
