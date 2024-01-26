import axios from '@/config/axios-config'

export const reissueAccessToken = async (accessToken, memberId) => {
  const response = await axios
    .post(
      '/token',
      { memberId: memberId },
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
