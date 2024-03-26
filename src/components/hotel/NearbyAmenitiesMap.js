import React, {useEffect, useRef, useState} from "react"
import {
    Pagination,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react"
import {CustomRadio} from "@/components/ui/CustomRadio"
import axios from "axios"
import calculateDistance from "@/util/calculateDistance"
import TouristSpotSearch from "@/components/touristSpot/TouristSpotSearch"
import {useAsyncList} from "@react-stately/data";

export default function NearbyAmenitiesMap({hotel}) {
    const mapRef = useRef(null) // 지도를 표시할 DOM 요소에 대한 참조
    const [map, setMap] = useState(null) // 지도 인스턴스
    const [address, setAddress] = useState(hotel?.address)
    const [centerCoords, setCenterCoords] = useState()
    const [nearAmenities, setNearAmenities] = useState([])
    const [markers, setMarkers] = useState([])
    const [category, setCategory] = useState("food")
    const [distance, setDistance] = useState("100")
    const [showTouristSpots, setShowTouristSpots] = useState(false)
    const [touristSpots, setTouristSpots] = useState([])

    const [page, setPage] = React.useState(1)
    const rowsPerPage = 9
    const pages = Math.ceil(nearAmenities?.length / rowsPerPage)

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
                        return alert("주소를 찾을 수 없습니다.")
                    }

                    const result = response.v2.addresses[0]
                    const coords = new naver.maps.LatLng(result?.y, result?.x)

                    setCenterCoords(coords)

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
                        },
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
        if (category === "tourspot") {
            clearMarkers()
            setShowTouristSpots(true)
        } else if (map && centerCoords && category === "food") {
            setShowTouristSpots(false)
            clearMarkers()
            axios
                .get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/locations/${category}?latitude=${centerCoords.lat()}&longitude=${centerCoords.lng()}&distance=${distance}`
                )
                .then((r) => {
                    let newData = r.data.map((v) => {
                        return {
                            id: v.id,
                            name: v.name,
                            coord: {...v.coord},
                            dist: calculateDistance(v.coord.y, v.coord.x, centerCoords?.lat(), centerCoords?.lng()),
                        }
                    })
                    setNearAmenities(newData)
                    setPage(1)
                    map.setCenter(centerCoords)
                })
        }
    }, [centerCoords, category, distance])

    const clearMarkers = () => {
        markers.forEach((v) => {
            v.setMap(null)
        })
        setMarkers([])
    }

    useEffect(() => {
        if (nearAmenities.length !== 0) {
            if (!showTouristSpots) {
                if (markers.length !== 0) {
                    markers.forEach((v, index) => {
                        v.setMap(null)
                    })
                    setMarkers([])
                }
                nearAmenities.forEach((v) => {
                    let latLng = new naver.maps.LatLng(v.coord.y, v.coord.x)

                    markers.push(
                        new naver.maps.Marker({
                            position: latLng,
                            title: v.name,
                            map: map,
                            icon: {
                                content: `<div id="m-${v.id}" class="hidden border-solid bg-blue-100 border-2 border-white rounded-md w-11 h-11 overflow-hidden -translate-x-1/2 -translate-y-[130%]">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 21V3M15 21V3C17.2091 3 19 4.79086 19 7V9C19 11.2091 17.2091 13 15 13M11 3V8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8V3" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </div>`,
                            },
                            zIndex: 100,
                        })
                    )
                })
            }
        }
    }, [nearAmenities])

    const handleOverInfo = (id) => {
        const element = document.getElementById("m-" + id)

        if (element) {
            element.style.border = "2px solid #2563EB"
            element.style.display = "block"
        }
    }

    const handleOutInfo = (id) => {
        const element = document.getElementById("m-" + id)

        if (element) {
            element.style.border = "2px solid #fff"
            element.style.display = "none"
        }
    }

    const clearHtmlTags = (html) => {
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = html
        return tempDiv.textContent || tempDiv.innerText || ""
    }

    const renderCell = (item, columnKey) => {
        if (centerCoords) {
            switch (columnKey) {
                case "dist":
                    return (
                        <div>
                            {item?.dist}
                            m
                        </div>
                    )
                case "name":
                    return clearHtmlTags(item.name)
            }
        }
    }

    useEffect(() => {
        if (showTouristSpots && touristSpots.length > 0 && map) {
            let newTouristSpots = []

            touristSpots.forEach((v, index) => {
                newTouristSpots.push({
                    id: index,
                    name: v.title,
                    coord: {x: v.mapx / 10000000, y: v.mapy / 10000000},
                    dist: calculateDistance(v.mapy / 10000000, v.mapx / 10000000, centerCoords?.lat(), centerCoords?.lng())
                })
            })

            setNearAmenities(newTouristSpots)
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

                const cleanTitle = document.createElement("div")
                cleanTitle.innerHTML = spot.title
                const textTitle = cleanTitle.textContent || cleanTitle.innerText

                // 마커에 정보 창 추가
                const infoWindow = new naver.maps.InfoWindow({
                    content: `<div style="background-color: #ffffff; padding: 5px; font-family: omyu_pretty, sans-serif; font-weight: bold">${textTitle}</div>`,
                    disableAnchor: true, // 화살표 비활성화
                    borderColor: "transparent",
                })

                naver.maps.Event.addListener(marker, "mouseover", function () {
                    infoWindow.open(map, marker)
                })

                // 마커를 클릭하는 이벤트 핸들러
                naver.maps.Event.addListener(marker, "click", function () {
                    const query = encodeURIComponent(textTitle) // 마커의 타이틀을 인코딩
                    const searchUrl = `https://search.naver.com/search.naver?query=${query}`

                    // 생성된 검색 URL로 리다이렉트
                    window.open(searchUrl, "_blank")
                })

                naver.maps.Event.addListener(marker, "mouseout", function () {
                    infoWindow.close()
                })
                console.log("Marker added:", marker)

                markers.push(marker)
            })
            map.fitBounds(bounds)
        }
    }, [showTouristSpots, touristSpots, map])

    let list = useAsyncList({
        async load({signal}) {
            return {items: nearAmenities}
        },
        async sort({items, sortDescriptor}) {
            return {
                items: items.sort((a, b) => {
                    let first = a[sortDescriptor.column];
                    let second = b[sortDescriptor.column];
                    let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

                    if (sortDescriptor.direction === "descending") {
                        cmp *= -1;
                    }

                    return cmp;
                })
            }
        },
    })

    useEffect(() => {
        list.reload();
    }, [nearAmenities])

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return list.items?.slice(start, end)
    }, [page, list.items])

    return (
        <div className={"flex flex-col"}>
            {showTouristSpots && (
                <TouristSpotSearch
                    hotelAddress={address}
                    onSearchResult={setTouristSpots}
                />
            )}
            <RadioGroup
                orientation={"horizontal"}
                isDisabled={showTouristSpots}
                onValueChange={setDistance}
                defaultValue={"100"}
            >
                <Radio value={"100"}>100M</Radio>
                <Radio value={"300"}>300M</Radio>
                <Radio value={"500"}>500M</Radio>
            </RadioGroup>
            <div className={"flex gap-3"}>
                <div ref={mapRef} style={{width: "50%", height: "400px"}}>
                    <RadioGroup
                        className={"z-10"}
                        classNames={{wrapper: ["!flex-row"]}}
                        onValueChange={(v) => {
                            setCategory(v)
                        }}
                        defaultValue={"food"}
                    >
                        <CustomRadio value={"food"}>음식점</CustomRadio>
                        <CustomRadio value={"tourspot"}>여행지</CustomRadio>
                    </RadioGroup>
                </div>
                <div className={"flex flex-col w-1/5 items-center"}>
                    <div>
                        근처 {showTouristSpots ? "여행지" : distance + "M"} 결과{" "}
                        {nearAmenities.length}개
                    </div>
                    <Table
                        aria-label={"Nearby Amenities"}
                        classNames={{
                            base: ["w-full h-[400px]"],
                            wrapper: ["w-full h-[400px]"],
                            table: ["w-full flex flex-col"],
                            tbody: ["flex flex-col w-full h-[250px] overflow-y-auto"],
                            tr: [
                                "flex flex-row justify-between hover:shadow-[0_0_0_2px_#006eff_inset] hover:cursor-pointer",
                            ],
                            td: ["!text-xs flex items-center"],
                            th: ["flex items-center text-xs w-full"],
                        }}
                        bottomContent={
                            <div className='flex w-full justify-center'>
                                <Pagination
                                    size={"sm"}
                                    isCompact
                                    showControls
                                    showShadow
                                    color='secondary'
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                    classNames={{
                                        wrapper: ["flex w-full"],
                                        item: ["relative min-w-0"],
                                    }}
                                />
                            </div>
                        }
                        sortDescriptor={list.sortDescriptor}
                        onSortChange={list.sort}
                    >
                        <TableHeader>
                            <TableColumn key={"name"}>NAME</TableColumn>
                            <TableColumn key={"dist"} allowsSorting>DISTANCE</TableColumn>
                        </TableHeader>
                        <TableBody items={items}>
                            {(item) => (
                                <TableRow
                                    key={item.id}
                                    onMouseOver={() => handleOverInfo(item.id)}
                                    onMouseOut={() => handleOutInfo(item.id)}
                                >
                                    {(columnKey) => (
                                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
