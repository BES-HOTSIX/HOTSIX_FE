'use client'

import instance from "@/config/axios-config"
import { Card, CardBody, Skeleton, Pagination } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import { useRouter } from 'next/navigation'
import axios from "axios"
import { Avatar, Chip } from "@nextui-org/react";
import { format } from 'date-fns';

export default function MyChatRooms() {
	const [page, setPage] = useState(1)
	const router = useRouter();

	const chatRoomsQuery = useQuery({
		queryKey: ["chatRooms", page],
		queryFn: () =>
			instance
				.get(`/api/v1/members/me/chatRooms?page=${page - 1}`, {
					...axios.defaults,
					useAuth: true,
				})
				.then((res) => res.data),
			keepPreviousData: true,
	})

	const pages = useMemo(
		() => chatRoomsQuery.data?.objData.totalPages ?? 0,
		[chatRoomsQuery.data?.objData.totalPages]
	)

	if (chatRoomsQuery.isLoading) {
		return <div>loading</div>
	}

	return (
		<div className="flex h-screen">
			<div className={"flex flex-col w-full gap-5 px-5"}>
				{pages === 0 && <div>문의내역이 없습니다.</div>}
				{chatRoomsQuery.isLoading &&
					Array(4)
						.fill(0)
							.map((_, index) => {
								return <Skeleton key={index} height={200}/>
							})
				}
				{chatRoomsQuery.isSuccess &&
					chatRoomsQuery.data?.objData.content.map((chatRoom, index) => {
						return (
							<Card key={index} className={"!overflow-visible"} isPressable isHoverable disableAnimation onPress={() => router.push(`/chat/${chatRoom.chatRoomId}`)}>
								<CardBody>
									<div className={"flex gap-5"}>
										<div className={"flex items-center justify-center relative w-1/6 rounded-md overflow-hidden"}>
												<Avatar src={chatRoom.contactImage} className={"w-24 h-24"} />
										</div>
										<div className={"flex flex-col justify-between w-full"}>
											<div className={"flex justiy-between items-center w-full"}>
												<div className={"text-2xl"}>{chatRoom.contactNickname}</div>
												<div className="text-base text-gray-500 ml-auto mr-3">{format(new Date(chatRoom.latestDate), 'MM/dd HH:mm')}</div>
											</div>
											<div className={"flex justiy-between items-center w-full mb-2"}>
												{chatRoom.left &&
													<Chip size="md" color="danger" variant="flat">채팅 종료</Chip>
												}
												{chatRoom.unread > 0 &&
													<Chip className="ml-auto mr-3 text-sm" size="md" color="primary">{chatRoom.unread}</Chip>
												}
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
						)
					})
				}
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
					) : null
				}
			</div>
		</div>
	)
}
