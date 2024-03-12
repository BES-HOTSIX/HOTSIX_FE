import React, { useState, useEffect } from "react"
import axios from "@/config/axios-config"

function TouristSpotSearch({ hotelAddress, onSearchResult }) {
  const [touristSpot, setTouristSpot] = useState([])

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
        if (data.items && Array.isArray(data.items)) {
          setTouristSpot(data.items)
          onSearchResult(data.items)
        } else {
          console.error("Invalid response format")
        }
      } catch (error) {
        console.error("API Request Error:", error)
      }
    }

    if (hotelAddress) {
      console.log("Search Address:", hotelAddress)
      searchTouristSpot(hotelAddress)
    }
  }, [hotelAddress, onSearchResult, setTouristSpot])

  return (
    <div>
      <h2>touristSpot</h2>
      <ul>
        {Array.isArray(touristSpot) &&
          touristSpot.map((spot, index) => <li key={index}>{spot.title}</li>)}
      </ul>
    </div>
  )
}

export default TouristSpotSearch
