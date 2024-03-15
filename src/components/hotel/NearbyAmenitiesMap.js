import React, {useEffect, useRef, useState} from "react";
import {Card, CardBody, RadioGroup, ScrollShadow} from "@nextui-org/react";
import {CustomRadio} from "@/components/ui/CustomRadio";
import axios from "axios";
import calculateDistance from "@/util/calculateDistance";

export default function NearbyAmenitiesMap({hotel}) {
    const mapRef = useRef(null) // 지도를 표시할 DOM 요소에 대한 참조
    const [map, setMap] = useState(null) // 지도 인스턴스
    const [address, setAddress] = useState(hotel?.address)
    const [centerCoords, setCenterCoords] = useState()
    const [nearAmenities, setNearAmenities] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [category, setCategory] = useState("food");

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

                    setCenterCoords(coords);

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

    useEffect(() => {
        if (category !== "food") {
            markers.forEach((v) => {
                v.setMap(null);
            })
            setMarkers([])
        } else if (map && centerCoords) {
            axios.get(`http://localhost:8080/api/v1/locations/${category}?latitude=${centerCoords.lat()}&longitude=${centerCoords.lng()}&distance=500`).then((r) => {
                setNearAmenities(r.data);
            })
        }
    }, [centerCoords, category])

    useEffect(() => {
        if (nearAmenities.length !== 0) {
            if (markers.length !== 0) {
                markers.forEach((v, index) => {
                    v.setMap(null);
                })
                setMarkers([])
            }
            nearAmenities.forEach((v, index) => {
                let latLng = new naver.maps.LatLng(v.coord.y, v.coord.x);

                markers.push(new naver.maps.Marker({
                    position: latLng,
                    title: v.name,
                    map: map,
                    icon: {
                        content: `<div id="m-${index}" class="border-solid bg-blue-100 border-2 border-white rounded-md w-11 h-11 overflow-hidden -translate-x-1/2 -translate-y-[130%]">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 21V3M15 21V3C17.2091 3 19 4.79086 19 7V9C19 11.2091 17.2091 13 15 13M11 3V8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8V3" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </div>`,
                    },
                    zIndex: 100
                }))
            })
        }
    }, [nearAmenities]);

    const handleOverInfo = (id) => {
        console.log(id);
        const element = document.getElementById("m-" + id);

        if (element) {
            element.style.border = "2px solid #2563EB";
        }
    }

    const handleOutInfo = (id) => {
        const element = document.getElementById("m-" + id);

        if (element) {
            element.style.border = "2px solid #fff";
        }
    }

    return (
        <div className={"flex gap-3"}>
            <div ref={mapRef} style={{width: '50%', height: '400px'}}>
                <RadioGroup className={"z-10"} classNames={{wrapper: ["!flex-row"]}} onValueChange={setCategory}
                            defaultValue={"food"}>
                    <CustomRadio value={"food"}>음식점</CustomRadio>
                    <CustomRadio value={"cafe"}>카페</CustomRadio>
                </RadioGroup>
            </div>
            <Card className={"w-1/5 h-[400px]"}>
                <ScrollShadow hideScrollBar>
                    <CardBody className={"gap-3"}>
                        {nearAmenities?.map((v, index) => {
                            return (
                                <Card key={index} onMouseOver={() => handleOverInfo(index)}
                                      onMouseOut={() => handleOutInfo(index)}
                                >
                                    <CardBody className={"flex-col"}>
                                        <div>{v.name}</div>
                                        <div>{calculateDistance(v.coord.y, v.coord.x, centerCoords.lat(), centerCoords.lng())}m</div>
                                    </CardBody>
                                </Card>
                            )
                        })}
                    </CardBody>
                </ScrollShadow>
            </Card>
        </div>
    )
}