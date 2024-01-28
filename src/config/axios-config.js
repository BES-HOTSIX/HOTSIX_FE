import axios from 'axios'
import {
  checkAndSetToken,
  handleAPIError,
  handleTokenError,
} from '@/api/interceptors'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  Headers: {
    'Content-Type': 'application/json',
  },
  useAuth: false,
})

instance.interceptors.request.use(checkAndSetToken, checkAndSetToken)

instance.interceptors.response.use(
  (response) => response,
  (error) => handleTokenError(error, handleTokenError)
)

instance.interceptors.response.use(
  (response) => response,
  (error) => handleAPIError(error, handleAPIError)
)

export const apiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CLIENT_URL,
  withCredentials: true,
  Headers: {
    'Content-Type': 'application/json',
  },
})

export const fileApiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  Headers: {
    'Content-Type': 'multipart/form-data',
  },
  useAuth: false,
})

fileApiAxios.interceptors.request.use(checkAndSetToken, checkAndSetToken)
fileApiAxios.interceptors.response.use(
  (response) => response,
  (error) => handleTokenError(error, handleTokenError)
)
fileApiAxios.interceptors.response.use(
  (response) => response,
  (error) => handleAPIError(error, handleAPIError)
)

export default instance
