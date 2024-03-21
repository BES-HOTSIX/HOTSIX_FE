import React, { useState, useEffect } from "react"
import axios from "@/config/axios-config"

function TouristSpotSearch({ hotelAddress, onSearchResult }) {
  useEffect(() => {
    const searchTouristSpot = async (address) => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/v1/search/local.json?query=${address}`
        const response = await axios.get(apiUrl)

        // 에러 확인
        if (response.data.error) {
          console.error("API Error:", response.data.error)
          return
        }

        // 정상적인 응답 확인
        const data = response.data
        console.log("API Response:", data)

        // data.items가 존재하고 배열인지 확인 후 사용
        if (data && Array.isArray(data)) {
          // 관광지 데이터를 전달하여 상태 업데이트
          onSearchResult(data)
        } else {
          console.error("Invalid response format")
        }
      } catch (error) {
        console.error("API Request Error:", error)
      }
    }

    if (hotelAddress) {
      searchTouristSpot(hotelAddress)
    }
  }, [hotelAddress, onSearchResult])

  return null // 렌더링하지 않음
}

export default TouristSpotSearch
