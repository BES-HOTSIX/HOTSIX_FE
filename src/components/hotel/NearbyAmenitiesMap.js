import React, { useEffect, useRef, useState } from "react"
import axios from "@/config/axios-config"
import TouristSpotSearch from "@/components/touristSpot/TouristSpotSearch"
import { Button, ButtonGroup } from "@nextui-org/react"

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
      // 관광지 정보가 여러 개일 때 지도의 중심을 계산
      let bounds = new naver.maps.LatLngBounds()

      touristSpots.forEach((spot) => {
        const spots = new naver.maps.LatLng(
          spot.mapy / 10000000,
          spot.mapx / 10000000
        )

        bounds.extend(spots) // 관광지 위치를 포함하도록 경계 확장

        const marker = new naver.maps.Marker({
          position: spots,
          map: map,
        })
        // 마커의 아이콘 색상 변경
        marker.getElement().style.backgroundColor = "yellow"

        const cleanTitle = document.createElement("div")
        cleanTitle.innerHTML = spot.title
        const textTitle = cleanTitle.textContent || cleanTitle.innerText

        // 마커에 정보 창 추가
        const infoWindow = new naver.maps.InfoWindow({
          content: `<div style="font-weight: normal;">${textTitle}</div>`, // HTML 태그가 제거된 텍스트

          backgroundColor: "transparent", // 배경색을 투명하게 설정
          borderColor: "transparent", // 테두리색을 투명하게 설정
        })

        naver.maps.Event.addListener(marker, "mouseover", function () {
          infoWindow.open(map, marker)
        })

        // 마커를 클릭하는 이벤트 핸들러
        naver.maps.Event.addListener(marker, "click", function () {
          const query = encodeURIComponent(textTitle) // 마커의 타이틀을 인코딩
          const searchUrl = `https://search.naver.com/search.naver?query=${query}`

          // 생성된 검색 URL로 리다이렉트
          window.location.href = searchUrl
        })

        naver.maps.Event.addListener(marker, "mouseout", function () {
          infoWindow.close()
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
        <ButtonGroup>
          <Button onClick={handleShowTouristSpots}>근처 볼거리</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
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
