import { useQuery } from "@tanstack/react-query"
import axios from '@/config/axios-config'

/**  상세 정보 */
const fetchReservationDetail = async (reserveId) => {
	const res = await axios.get(`api/v1/reserve/detail/${reserveId}`)

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

/**  취소 상세 정보 */
const fetchReservationCancelDetail = async (reserveId) => {
	const res = await axios.get(`api/v1/reserve/cancel/detail/${reserveId}`)

	return res.data
}

export const useReservationCancelDetail = (reserveId) => {
	const {
		data: reservation,
		isLoading,
		isFetching,
		isError,
		error,
	} = useQuery({
		queryKey: ['reservationCancelDetail', reserveId],
		queryFn: () => fetchReservationCancelDetail(reserveId),
	})

	return { reservation, isLoading, isFetching, isError, error }
}
