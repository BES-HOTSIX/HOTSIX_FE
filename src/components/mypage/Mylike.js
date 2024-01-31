'use client'
import {useMemo, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import instance from "@/config/axios-config";
import axios from "axios";
import {Button, Card, CardBody, Image, Link, Pagination, Skeleton} from "@nextui-org/react";
import formatToKRW from "@/util/formatToKRW";

export default function MyLike() {
    const [page, setPage] = useState(1);

    const likesHotelsQuery = useQuery({
        queryKey: ['likes', page],
        queryFn: () => instance.get(`api/v1/members/me/likes?page=${page - 1}`, {
            ...axios.defaults,
            useAuth: true,
        }).then((res) => res.data),
        placeholderData: keepPreviousData
    })

    const pages = useMemo(() => likesHotelsQuery.data?.objData.totalPages ?? 0, [likesHotelsQuery.data?.objData.totalPages])
    return (
        <div className='flex h-screen'>
            <div className={"flex flex-col w-full gap-5 px-5"}>
                {pages === 0 && <div>찜한내역이 없습니다.</div>}
                {likesHotelsQuery.isLoading && Array(4).fill(0).map((_, index) => {
                    return (
                        <Skeleton key={index} height={200}/>
                    )
                })}
                {likesHotelsQuery.isSuccess && likesHotelsQuery.data?.objData.content.map((hotel, index) => {
                    return (
                        <Card key={index} className={"!overflow-visible"}>
                            <CardBody>
                                <div className={"flex gap-5"}>
                                    <Image
                                        src={hotel.imagesResponse.imageUrl[0]}
                                        width={150}
                                    />
                                    <div className={"flex flex-col justify-between"}>
                                        <div className={"text-2xl"}>{hotel.nickname}</div>
                                        <div className={"flex"}>
                                            <div>{hotel.hotelType}</div>
                                            <div className={"mx-2"}>|</div>
                                            <div>{formatToKRW(hotel.price)}원</div>
                                        </div>
                                    </div>

                                    <div className={"flex flex-col ml-auto justify-between"}>
                                        <Button>찜 취소</Button>
                                        <Button as={Link} href={`/hotel/${hotel.id}`}>상세보기</Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    )
                })}
                {
                    pages > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    ) : null
                }
            </div>
        </div>
    )
}