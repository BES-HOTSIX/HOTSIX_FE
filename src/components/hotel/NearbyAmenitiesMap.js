import React, {useEffect, useRef, useState} from "react";

export default function NearbyAmenitiesMap({hotel}) {
    const mapRef = useRef(null) // 지도를 표시할 DOM 요소에 대한 참조
    const [map, setMap] = useState(null) // 지도 인스턴스
    const [address, setAddress] = useState(hotel?.address)

    useEffect(() => {
        // 네이버 지도 API 스크립트가 이미 로드되었는지 확인
        if (!map && window.naver && window.naver.maps) {
            initMap()
        } else if (!map) {
            // 스크립트가 아직 로드되지 않았다면 로드를 기다림
            const checkIfNaverMapsIsLoaded = setInterval(() => {
                if (window.naver && window.naver.maps) {
                    clearInterval(checkIfNaverMapsIsLoaded)
                    initMap()
                }
            }, 100)
        }
        if (address && map) {

            naver.maps.Service.geocode(
                {
                    query: address,
                },
                function (status, response) {
                    if (status !== naver.maps.Service.Status.OK) {
                        return alert('주소를 찾을 수 없습니다.')
                    }

                    const result = response.v2.addresses[0]
                    const coords = new naver.maps.LatLng(result?.y, result?.x)

                    // 지도 중심 이동
                    map.setCenter(coords)

                    // 지도 확대
                    map.setZoom(15)

                    // 마커 생성 (선택적)
                    new naver.maps.Marker({
                        position: coords,
                        map: map,
                        icon: {
                            content: `<div class="border-solid border-2 border-blue-700 rounded-md w-11 h-11 overflow-hidden -translate-x-1/2 -translate-y-[130%]">
                                <img class="w-full h-full object-cover" src="${hotel?.imagesResponse.imageUrl[0]}" alt="marker"/>
                            </div>`,
                        }
                    })
                }
            )
        }
    }, [address, map])

    // 지도 초기화 함수
    function initMap() {
        // 지도를 생성할 때 필요한 옵션 설정
        const mapOptions = {
            center: new naver.maps.LatLng(37.3595704, 127.105399), // 지도의 초기 중심 좌표
            zoom: 10, // 지도의 초기 확대 레벨
        }

        // 지도 생성
        const createdMap = new naver.maps.Map(mapRef.current, mapOptions)

        // 지도 상태 업데이트
        setMap(createdMap)
    }

    return (<div ref={mapRef} style={{width: '50%', height: '400px'}}>
    </div>)
}