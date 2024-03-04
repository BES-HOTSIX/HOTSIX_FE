import { useMutation, useQuery } from '@tanstack/react-query'
import axios from '@/config/axios-config'
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
      console.log(res)
      const accessToken = res.data.objData.accessToken

      console.log(accessToken)

      sessionStorage.setItem('ACCESS_TOKEN_KEY', accessToken)
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

const fetchKakaoLoginUser = async (code) => {
  return await axios.post('/login/kakao', { code: code })
}

export const useKakaoLoginUser = () => {
  const {
    mutate: submitKakaoLoginUser,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: 'kakaoLogin',
    mutationFn: (code) => {
      return fetchKakaoLoginUser(code)
    },
    onSuccess: (res) => {
      console.log(res)
      const accessToken = res.data.objData.accessToken

      console.log(accessToken)

      sessionStorage.setItem('ACCESS_TOKEN_KEY', accessToken)
      axios.defaults.headers.Authorization = `Bearer ${accessToken}`

      toast.success('로그인에 성공했습니다!')

      window.location.href = '/'
    },
    onError: (err) => {
      console.log(err)

      return err
    },
  })

  return { submitKakaoLoginUser, isPending, isError, error }
}

const fetchGoogleLoginUser = async (code) => {
  return await axios.post('/login/google', { code: code })
}

export const useGoogleLoginUser = () => {
  const {
    mutate: submitGoogleLoginUser,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: 'googleLogin',
    mutationFn: (code) => {
      return fetchGoogleLoginUser(code)
    },
    onSuccess: (res) => {
      console.log(res)
      const accessToken = res.data.objData.accessToken

      console.log(accessToken)

      sessionStorage.setItem('ACCESS_TOKEN_KEY', accessToken)
      axios.defaults.headers.Authorization = `Bearer ${accessToken}`

      toast.success('로그인에 성공했습니다!')

      window.location.href = '/'
    },
    onError: (err) => {
      console.log(err)

      return err
    },
  })

  return { submitGoogleLoginUser, isPending, isError, error }
}

const fetchNaverLoginUser = async (secret) => {
  console.log('fecth function ', secret.code, secret.state)
  return await axios.post('/login/naver', {
    code: secret.code,
    state: secret.state,
  })
}

export const useNaverLoginUser = () => {
  const {
    mutate: submitNaverLoginUser,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: 'naverLogin',
    mutationFn: (secret) => {
      return fetchNaverLoginUser(secret)
    },
    onSuccess: (res) => {
      console.log(res)
      const accessToken = res.data.objData.accessToken

      console.log(accessToken)

      sessionStorage.setItem('ACCESS_TOKEN_KEY', accessToken)
      axios.defaults.headers.Authorization = `Bearer ${accessToken}`

      toast.success('로그인에 성공했습니다!')

      window.location.href = '/'
    },
    onError: (err) => {
      console.log(err)

      return err
    },
  })

  return { submitNaverLoginUser, isPending, isError, error }
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
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: 0,
  })
  return { user, isLoading, isError, error, refetch }
}

const fetchUserRole = async (role) => {
  return await axios.post(
    '/api/v1/members/role',
    { role: role },
    {
      ...axios.defaults,
      useAuth: true,
    }
  )
}

export const useUserRole = () => {
  const {
    mutate: submitUserRole,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (role) => {
      return fetchUserRole(role)
    },
    onSuccess: (res) => {
      console.log(res)

      toast.success('HotShare에 오신 걸 환영합니다.🎉')
      window.location.href = '/'
    },
    onError: (err) => {
      toast.error('다시 한번 시도해주세요. 🥲')

      return err
    },
  })

  return { submitUserRole, isPending, isError, error }
}
