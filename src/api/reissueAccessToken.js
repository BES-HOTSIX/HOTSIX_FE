import axios from '@/config/axios-config'

export const reissueAccessToken = async (accessToken) => {
  const response = await axios
    .post(
      '/token',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((res) => {
      return res
    })
  return response
}
