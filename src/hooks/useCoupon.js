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

/** 첫 예약 시 쿠폰 발급 */
const fetchIssueFirstReservationCoupon = async () => {
  return await axios.post(
    '/api/v1/coupons/new/issue',
    {},
    {
      useAuth: true,
    }
  )
}

export const useIssueFirstReservationCoupon = () => {
  const queryClient = useQueryClient()
  const {
    mutate: issueCoupon,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: fetchIssueFirstReservationCoupon,
    onSuccess: () => {
      toast.success('첫 예약 10% 할인 쿠폰이 성공적으로 발급되었습니다!')
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
    onError: () => {
      toast.error('쿠폰 발급에 실패했습니다 🥲')
    },
  })

  return { issueCoupon, isPending, isError, error }
}
