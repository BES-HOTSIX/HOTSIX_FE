import React, { useState, useEffect } from "react"

function TouristSpotSearch({ hotelAddress, onSearchResult }) {
  const [touristSpot, setTouristSpot] = useState([])

  useEffect(() => {
    const searchTouristSpot = async (address) => {
      try {
        const apiUrl = `/v1/search/local.json?query=${address}`
        const response = await fetch(apiUrl, {
          headers: {
            "X-Naver-Client-Id": process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
            "X-Naver-Client-Secret":
              process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
          },
        })

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`)
        }

        const data = await response.json()

        // 성공적으로 데이터를 받아온 경우의 로직
        console.log("API Response:", data)

        setTouristSpot(data.items)
        onSearchResult(data.items)
      } catch (error) {
        // 에러 처리
        console.error("Error during fetch:", error)
      }
    }

    if (hotelAddress) {
      // 콘솔에 검색어 확인
      console.log("Search Address:", hotelAddress)

      searchTouristSpot(hotelAddress)
    }
  }, [hotelAddress, onSearchResult, setTouristSpot])

  return (
    <div>
      <h2>touristSpot</h2>
      <ul>
        {touristSpot.map((spot, index) => (
          <li key={index}>{spot.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default TouristSpotSearch
