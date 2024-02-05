import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import axios, { fileApiAxios } from '@/config/axios-config'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { HTTP_STATUS_CODE, ERROR_CODE } from '@/constants/constants'

/** 호텔 등록 */
const fetchRegisterHotel = async (formData) => {
  return await fileApiAxios.post('/api/v1/hotels', formData, {
    ...axios.defaults,
    useAuth: true,
  })
}

export const useRegisterHotel = () => {
  const queryClient = useQueryClient()
  const {
    mutate: submitRegister,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (formData) => {
      for (let [key, value] of formData.entries()) {
        console.log(key, value)
      }
      return fetchRegisterHotel(formData)
    },
    onSuccess: (res) => {
      toast.success('호텔이 성공적으로 등록되었습니다!')
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
    onError: (err) => {
      console.log('호텔 등록 실패')

      const { statusCode, code } = err ?? {}

      if (
        statusCode === HTTP_STATUS_CODE.BAD_REQUEST &&
        code === ERROR_CODE.EXPIRED_ACCESS_TOKEN
      ) {
        toast.success('호텔이 성공적으로 등록되었습니다!')
        queryClient.invalidateQueries({ queryKey: ['hotels'] })
      } else {
        toast.error('호텔 등록에 실패했습니다 🥲')
      }
      return err
    },
  })

  return { submitRegister, isPending, isError, error }
}

const fetchHotels = async (page) => {
  const { data } = await axios.get(`/api/v1/hotels?page=${page}`)

  console.log('fetchHotels')

  return data
}

export const useHotels = (page) => {
  const {
    data: hotels,
    isLoading,
    isFetching,
    isError,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['hotels', page],
    queryFn: () => fetchHotels(page),
    retry: 0,
    placeholderData: keepPreviousData,
  })

  return { hotels, isLoading, isFetching, isError, error, isPlaceholderData }
}

/** 호텔 상세 정보 */
const fetchHotelDetail = async (hotelId) => {
  const res = await axios.get(`api/v1/hotels/${hotelId}`)

  if (!res.data.result) return res.data

  return res.data.objData
}

export const useHotelDetail = (hotelId) => {
  const {
    data: hotel,
    isLoading: isHotelLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['hotelDetail', hotelId],
    queryFn: () => fetchHotelDetail(hotelId),
  })

  return { hotel, isHotelLoading, isFetching, isError, error }
}

/** 호텔 정보 수정 */
const fetchHotelModify = async (hotelId, formData) => {
  const res = await fileApiAxios.put(`/api/v1/hotels/${hotelId}`, formData, {
    ...axios.defaults,
    useAuth: true,
  })

  return res.data
}

export const useModifyHotel = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    mutate: submitModify,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: ({ hotelId, formData }) => fetchHotelModify(hotelId, formData),
    onSuccess: (res) => {
      console.log('호텔 수정 성공')
      console.log(res)

      toast.success('호텔 수정이 완료되었습니다!')

      queryClient.invalidateQueries({ queryKey: ['hotelDetail'] })
      router.back()
    },
    onError: (err) => {
      console.log('상품 수정 실패')

      const { statusCode, code } = err ?? {}

      if (
        statusCode === HTTP_STATUS_CODE.BAD_REQUEST &&
        code === ERROR_CODE.EXPIRED_ACCESS_TOKEN
      ) {
        toast.success('호텔 수정이 완료되었습니다!')
        queryClient.invalidateQueries({ queryKey: ['hotelDetail'] })
        router.back()
      } else {
        toast.error('호텔 수정이 이루어지지 않았어요 🥲')
      }

      return err
    },
  })

  return { submitModify, isPending, isError, error }
}

/** 호텔 삭제 */
const fetchHotelDelete = async (hotelId) => {
  const res = await axios.delete(`/api/v1/hotels/${hotelId}`, {
    ...axios.defaults,
    useAuth: true,
  })

  return res.data
}

export const useDeleteHotel = (hotelId) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    mutate: submitDelete,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: () => fetchHotelDelete(hotelId),
    onSuccess: (res) => {
      console.log('호텔 삭제 성공')
      console.log(res)

      toast.success('호텔이 삭제되었습니다!')
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      router.replace('/hotel')
    },
    onError: (err) => {
      console.log('호텔 삭제 실패')
      console.log(err)

      const { statusCode, code } = err ?? {}

      if (
        statusCode === HTTP_STATUS_CODE.BAD_REQUEST &&
        code === ERROR_CODE.EXPIRED_ACCESS_TOKEN
      ) {
        toast.success('호텔이 삭제되었습니다!')
        queryClient.invalidateQueries({ queryKey: ['hotels'] })
        router.replace('/hotel')
      } else {
        toast.error('호텔 삭제가 이루어지지 않았어요 🥲')
      }

      return err
    },
  })

  return { submitDelete, isPending, isError, error }
}

const fetchSearchHotels = async (page, district, startDate, endDate) => {
  const { data } = await axios.get(
    `/api/v1/hotels/search?page=${page}&district=${district}&startDate=${startDate}&endDate=${endDate}`
  )

  console.log('fetchSeartchHotels', data)

  return data
}

export const useSearchHotels = (page, district, startDate, endDate) => {
  const {
    data: hotels,
    isLoading,
    isFetching,
    isError,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['searchHotels', district, startDate, endDate, page],
    queryFn: () => fetchSearchHotels(page, district, startDate, endDate),
    retry: 0,
  })

  return { hotels, isLoading, isFetching, isError, error, isPlaceholderData }
}
