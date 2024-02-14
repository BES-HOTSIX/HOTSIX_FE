"use client"

import {keepPreviousData, useQuery} from "@tanstack/react-query"
import instance from "@/config/axios-config"
import axios from "axios"
import {Button, Card, CardBody, Chip, Link, Pagination, Skeleton} from "@nextui-org/react"
import {useMemo, useState} from "react"
import convertToISO8601 from "@/util/convertToISO8601"
import calculateDaysBetween from "@/util/calculateDaysBetween"
import isTimeBeforeNow from "@/util/isTimeBeforeNow";
import Image from "next/image";

export default function MyReservations() {
    const [page, setPage] = useState(1)

    const reservationsQuery = useQuery({
        queryKey: ["reservations", page],
        queryFn: () =>
            instance
                .get(`api/v1/members/me/reservations?page=${page - 1}`, {
                    ...axios.defaults,
                    useAuth: true,
                })
                .then((res) => res.data),
        placeholderData: keepPreviousData,
    })

    function isThreeDaysBefore(time) {
        let date = new Date(time);
        let now = new Date();
        let threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 현재 시간에서 3일을 뺀 시간

        return (date >= threeDaysAgo) && (date < now);
    }

    const pages = useMemo(
        () => reservationsQuery.data?.objData.totalPages ?? 0,
        [reservationsQuery.data?.objData.totalPages]
    )

    if (reservationsQuery.isLoading) return <div>로딩중...</div>

    return (
        <div className='flex h-screen'>
            <div className={"flex flex-col w-full gap-5 px-5"}>
                {pages === 0 && <div>예약내역이 없습니다.</div>}
                {reservationsQuery.isLoading &&
                    Array(4)
                        .fill(0)
                        .map((_, index) => {
                            return <Skeleton key={index} height={200}/>
                        })}
                {reservationsQuery.isSuccess &&
                    reservationsQuery.data?.objData.content.map((reservation, index) => {
                        return (
                            <Card key={index} className={"!overflow-visible"}>
                                <CardBody>
                                    <div className={"flex gap-5"}>
                                        <div className={"relative w-1/6 rounded-md overflow-hidden"}>
                                            <Image src={reservation.hotelPhotoUrl} alt="호텔 이미지"
                                                   layout={"fill"}/>
                                        </div>
                                        <div className={"flex flex-col justify-between"}>
                                            <div className={"text-2xl"}>{reservation.hotelNickname}</div>
                                            <div className={"flex gap-1"}>
                                                {isTimeBeforeNow(reservation.checkOutDate) && !reservation.cancelDate &&
                                                    <Chip size={"sm"} color="danger" radius={"md"}>이용완료</Chip>}
                                                {isThreeDaysBefore(reservation.checkInDate) &&
                                                    <Chip size={"sm"} color="success" radius={"md"}>이용예정</Chip>}
                                                {reservation.cancelDate &&
                                                    <Chip size={"sm"} color="warning" radius={"md"}>예약취소</Chip>}
                                                {reservation.hasMemberReviewedHotel &&
                                                    <Chip size={"sm"} color="primary" radius={"md"}>후기작성완료</Chip>}
                                            </div>
                                            <div className={"flex"}>
                                                <div>{convertToISO8601(reservation.checkInDate)} ~ {convertToISO8601(reservation.checkOutDate)}</div>
                                                <div className={"mx-2"}>|</div>
                                                <div>{calculateDaysBetween(reservation.checkOutDate, reservation.checkInDate)}박</div>
                                                <div className={"mx-2"}>|</div>
                                                <div>
                                                    {reservation.numOfGuests}명
                                                </div>
                                            </div>
                                        </div>

                                        <div className={"flex flex-col ml-auto justify-between gap-3"}>
                                            <Button
                                                as={Link}
                                                href={`/reserve/detail/${reservation.id}`}
                                            >
                                                상세보기
                                            </Button>
                                            <Button
                                                as={Link}
                                                href={`/review/${reservation.hotelId}/${reservation.id}`}
                                                isDisabled={!(isTimeBeforeNow(reservation.checkOutDate) && !reservation.cancelDate) || reservation.hasMemberReviewedHotel}
                                            >
                                                후기작성
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )
                    })}
                {pages > 0 ? (
                    <div className='flex w-full justify-center'>
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color='primary'
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    )
}
