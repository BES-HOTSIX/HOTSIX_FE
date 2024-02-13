import * as Sentry from '@sentry/react'
import axios, { AxiosError } from 'axios'
import axiosInstance from '@/config/axios-config'
import { reissueAccessToken } from '@/api/reissueAccessToken'
import { HTTP_STATUS_CODE, ERROR_CODE } from '@/constants/constants'
import { HTTPError } from '@/api/HTTPError'

export const checkAndSetToken = (config) => {
  if (!config.useAuth || config.headers.Authorization) return config

  const accessToken = sessionStorage.getItem('ACCESS_TOKEN_KEY')

  if (!accessToken) {
    console.log('토큰이 없습니다')
    throw new Error('토큰이 유효하지 않습니다')
  }

  config.headers.Authorization = `Bearer ${accessToken}`

  return config
}

export const handleTokenError = async (error) => {
  Sentry.withScope((scope) => {
    scope.setLevel('error')
    Sentry.captureMessage(
      `[TokenError] ${window.location.href} \n ${error.response?.data}`
    )
  })

  const originalRequest = error.config

  console.log(originalRequest)

  if (!error.response || !originalRequest)
    throw new Error('에러가 발생했습니다.')

  const { data, status } = error.response

  console.log(error.response)

  if (
    status === HTTP_STATUS_CODE.BAD_REQUEST &&
    data.code === ERROR_CODE.EXPIRED_ACCESS_TOKEN
  ) {
    const { accessToken } = await reissueAccessToken(
      sessionStorage.getItem('ACCESS_TOKEN_KEY')
    )
      .then((res) => {
        const accessToken = res.data.objData.accessToken
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        sessionStorage.setItem('ACCESS_TOKEN_KEY', accessToken)
        return axiosInstance(originalRequest)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (
    status === HTTP_STATUS_CODE.BAD_REQUEST &&
    (data.code === ERROR_CODE.INVALID_ACCESS_TOKEN ||
      data.code === ERROR_CODE.INVALID_REFRESH_TOKEN ||
      data.code === ERROR_CODE.EXPIRED_REFRESH_TOKEN ||
      data.code === ERROR_CODE.INVALID_TOKEN_VALIDATE ||
      data.code === ERROR_CODE.NULL_REFRESH_TOKEN ||
      data.code === ERROR_CODE.UNEXPECTED_TOKEN_ERROR ||
      data.code === ERROR_CODE.UNAUTHORIZED ||
      data.code === ERROR_CODE.INVALID_ACCESS_TOKEN)
  ) {
    throw new HTTPError(status, data.message, data.code)
  }

  throw error
}

export const handleAPIError = (error) => {
  Sentry.withScope((scope) => {
    scope.setLevel('error')
    Sentry.captureMessage(
      `[APIError] ${window.location.href} \n ${error.response?.data}`
    )
  })

  if (!error.response) throw error

  const { data, status } = error.response

  if (status >= HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR) {
    throw new HTTPError(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, data.message)
  }

  throw new HTTPError(status, data.message, data.code)
}
