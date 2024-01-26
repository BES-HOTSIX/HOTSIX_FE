import {
  QueryClient,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import axios, { fileApiAxios } from '@/config/axios-config'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/** 회원가입 */
const fetchRegisterUser = async (signupForm) => {
  return await axios.post('/api/v1/members/register', signupForm)
}

export const useRegisterUser = () => {
  const router = useRouter()
  const {
    mutate: submitRegisterUser,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (formData) => {
      return fetchRegisterUser(formData)
    },
    onSuccess: (res) => {
      console.log('회원가입 성공')
      console.log(res)

      if (!res.data.result) {
        toast.error('회원가입에 실패했습니다 🥲')
        return
      }

      router.push('/auth/signin')

      toast.success('회원가입에 성공했습니다!')
    },
    onError: (err) => {
      console.log('회원가입 실패')
      console.log(err)

      toast.error('회원가입에 실패했습니다 🥲')

      return err
    },
  })

  return { submitRegisterUser, isPending, isError, error }
}

const fetchLoginUser = async (signinForm) => {
  return await axios.post('/login', signinForm)
}

export const useLoginUser = () => {
  const {
    mutate: submitLoginUser,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (formData) => {
      return fetchLoginUser(formData)
    },
    onSuccess: (res) => {
      const loginResult = res.data.objData

      const accessToken = loginResult.accessToken
      const memberId = loginResult.memberId

      sessionStorage.setItem('ACCESS_TOKEN_KEY', accessToken)
      sessionStorage.setItem('MEMBER_ID', memberId)
      axios.defaults.headers.Authorization = `Bearer ${accessToken}`

      toast.success('로그인에 성공했습니다!')
      window.location.href = '/'
    },
    onError: (err) => {
      console.log('로그인 실패')
      console.log(err)

      toast.error('로그인에 실패했습니다 🥲')

      return err
    },
  })

  return { submitLoginUser, isPending, isError, error }
}

const fetchUser = async () => {
  const { data } = await axios.get('api/v1/members/info', {
    ...axios.defaults,
    useAuth: true,
  })
  return data
}

export function useUser() {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ['user'], queryFn: fetchUser, retry: 0 })
  return { user, isLoading, isError, error }
}
