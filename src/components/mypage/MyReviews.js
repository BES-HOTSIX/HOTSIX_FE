'use client'
import {useMemo, useState} from "react";
import {Button, Card, CardBody, Link, Pagination, Textarea} from "@nextui-org/react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import instance from "@/config/axios-config";
import axios from "axios";
import {Rating} from "@mui/material";
import connvertToISO8601 from "@/util/convertToISO8601";

export default function MyReviews() {
    const [page, setPage] = useState(1)

    const reviewsQuery = useQuery({
        queryKey: ["reviews", page],
        queryFn: () =>
            instance
                .get(`api/v1/members/me/reviews?page=${page - 1}`, {
                    ...axios.defaults,
                    useAuth: true,
                })
                .then((res) => res.data),
        placeholderData: keepPreviousData,
    })

    const pages = useMemo(
        () => reviewsQuery.data?.objData.totalPages ?? 0,
        [reviewsQuery.data?.objData.totalPages]
    )

    if (reviewsQuery.isLoading) return <div>로딩중...</div>

    if (pages === 0) return <div>작성한 리뷰가 없습니다.</div>

    return (
        <div>
            <div className={"flex flex-col"}>
                {/*reservationsQuery.data?.objData.content.map((reservation, index) => {*/}
                {reviewsQuery.data?.objData.content.map((review, index) => {
                    return (
                        <Card key={index}>
                            <CardBody>
                                <div className={"gap-3 flex flex-col"}>
                                    <Textarea
                                        isReadOnly
                                        defaultValue={review.body}
                                    />
                                    <div className={"flex justify-between items-center h-10"}>
                                        <div className={"flex gap-5"}>
                                            <div className={"flex items-center gap-2"}>
                                                평점
                                                <Rating value={review.totalRating} readOnly/>
                                            </div>
                                            <div>
                                                등록일 {connvertToISO8601(review.createdAt)}
                                            </div>
                                        </div>
                                        <Button
                                            as={Link}
                                            href={`/hotel/${review.hotelId}`}
                                        >호텔 상세보기</Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    )
                })}
            </div>
            {pages > 0 ? (
                <div className='flex w-full justify-center mt-5'>
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
    )
}