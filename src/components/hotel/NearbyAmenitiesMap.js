import React, { useEffect, useRef, useState } from "react"
import axios from "@/config/axios-config"
import TouristSpotSearch from "@/components/touristSpot/TouristSpotSearch"

export default function NearbyAmenitiesMap({ hotel }) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [address, setAddress] = useState(hotel?.address)
  const [showTouristSpots, setShowTouristSpots] = useState(false)
  const [touristSpots, setTouristSpots] = useState([])

  useEffect(() => {
    function initMap() {
      const mapOptions = {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 10,
      }

      const createdMap = new naver.maps.Map(mapRef.current, mapOptions)
      setMap(createdMap)
    }

    if (!map && window.naver && window.naver.maps) {
      initMap()
    } else if (!map) {
      const checkIfNaverMapsIsLoaded = setInterval(() => {
        if (window.naver && window.naver.maps) {
          clearInterval(checkIfNaverMapsIsLoaded)
          initMap()
        }
      }, 100)
    }
  }, [map])

  useEffect(() => {
    if (address && map) {
      naver.maps.Service.geocode(
        {
          query: address,
        },
        function (status, response) {
          if (status !== naver.maps.Service.Status.OK) {
            return alert("주소를 찾을 수 없습니다.")
          }

          const result = response.v2.addresses[0]
          const coords = new naver.maps.LatLng(result?.y, result?.x)

          map.setCenter(coords)
          map.setZoom(15)

          new naver.maps.Marker({
            position: coords,
            map: map,
          })
        }
      )
    }
  }, [address, map])

  useEffect(() => {
    if (showTouristSpots && touristSpots.length > 0 && map) {
      // 관광지 정보가 여러 개일 때 지도의 중심을 계산하기 위한 변수 선언
      let bounds = new naver.maps.LatLngBounds()

      touristSpots.forEach((spot) => {
        const spots = new naver.maps.LatLng(
          spot.mapy / 10000000,
          spot.mapx / 10000000
        )

        bounds.extend(spots) // 관광지 위치를 포함한 경계 확장

        const marker = new naver.maps.Marker({
          position: spots,
          map: map,
        })
        console.log("Marker added:", marker)
      })
      map.fitBounds(bounds)
    }
  }, [showTouristSpots, touristSpots, map])

  const handleShowTouristSpots = () => {
    setShowTouristSpots(true)
  }

  return (
    <div>
      <div className='flex justify-center mt-4'>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded'
          onClick={handleShowTouristSpots}
        >
          근처 볼거리
        </button>
      </div>
      {showTouristSpots && (
        <TouristSpotSearch
          hotelAddress={address}
          onSearchResult={setTouristSpots}
        />
      )}
      <div ref={mapRef} style={{ width: "50%", height: "400px" }}></div>
    </div>
  )
}
