"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import instance from "@/config/axios-config"
import axios from "axios"
import {
  Button,
  Card,
  CardBody,
  Image,
  Link,
  Pagination,
  Skeleton,
} from "@nextui-org/react"
import { useMemo, useState } from "react"
import convertToISO8601 from "@/util/convertToISO8601"
import calculateDaysBetween from "@/util/calculateDaysBetween"

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

  const pages = useMemo(
    () => reservationsQuery.data?.objData.totalPages ?? 0,
    [reservationsQuery.data?.objData.totalPages]
  )

  return (
    <div className='flex h-screen'>
      <div className={"flex flex-col w-full gap-5 px-5"}>
        {pages === 0 && <div>예약내역이 없습니다.</div>}
        {reservationsQuery.isLoading &&
          Array(4)
            .fill(0)
            .map((_, index) => {
              return <Skeleton key={index} height={200} />
            })}
        {reservationsQuery.isSuccess &&
          reservationsQuery.data?.objData.content.map((reservation, index) => {
            return (
              <Card key={index} className={"!overflow-visible"}>
                <CardBody>
                  <div className={"flex gap-5"}>
                    <Image src={reservation.hotelPhotoUrl} width={150} />
                    <div className={"flex flex-col justify-between"}>
                      <div className={"text-2xl"}>
                        {reservation.hotelNickname}
                      </div>
                      <div className={"flex"}>
                        <div>
                          {convertToISO8601(reservation.checkInDate)} ~{" "}
                          {convertToISO8601(reservation.checkOutDate)}
                        </div>
                        <div className={"mx-2"}>|</div>
                        <div>
                          {calculateDaysBetween(
                            reservation.checkOutDate,
                            reservation.checkInDate
                          )}
                          박
                        </div>
                        <div className={"mx-2"}>|</div>
                        <div>{reservation.numOfGuests}명</div>
                      </div>
                    </div>

                    <div className={"flex flex-col ml-auto justify-between"}>
                      <Button
                        as={Link}
                        href={`/reserve/detail/${reservation.id}`}
                      >
                        상세보기
                      </Button>
                      <Button
                        as={Link}
                        href={`/review/${reservation.hotelId}/${reservation.id}`}
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
