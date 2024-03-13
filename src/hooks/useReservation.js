import { useQuery } from '@tanstack/react-query'
import axios from '@/config/axios-config'

/**  상세 정보 */
const fetchReservationDetail = async (reserveId) => {
  const res = await axios.get(`api/v1/reserve/detail/${reserveId}`, {
    ...axios.defaults,
    useAuth: true,
  })

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

/** 숙소의 예약되어 있는 날짜 정보 */
const fetchReservedDatesOfHotel = async (hotelId) => {
  const res = await axios.get(`api/v1/reserve/reservedDates/${hotelId}`)

  return res.data.objData.reservedDates
}

export const useReservedDatesOfHotel = (hotelId) => {
  const {
    data: reservedDates,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['reservedDates', hotelId],
    queryFn: () => fetchReservedDatesOfHotel(hotelId),
  })

  return { reservedDates, isLoading, isFetching, isError, error }
}

/**  호스트 매출 현황 페이지 예약 현황 가져오기 */
export const fetchHostsHotelReservationDetail = async (
  page,
  year,
  month,
  hotelId
) => {
  const res = await axios.get(
    `api/v1/reserve/hosts/${hotelId}?page=${page}&year=${year}&month=${month}&hotelId=${hotelId}`,
    {
      ...axios.defaults,
      useAuth: true,
    }
  )

  return res.data
}
