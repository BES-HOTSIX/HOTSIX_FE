'use client'

import instance from "@/config/axios-config"
import { Skeleton, Pagination, Tabs, Tab } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import axios from "axios"
import ChatRoomCard from "../chat/ChatRoomCard"
import { useUser } from '@/hooks/useUser';

export default function MyChatRooms() {
	const [availablePage, setAvailablePage] = useState(1)
	const [exitedPage, setExitedPage] = useState(1)
	const { user, isLoading, isError } = useUser();

	const chatAvailableQuery = useQuery({
		queryKey: ["chatAvailable", availablePage],
		queryFn: () =>
			instance
				.get(`/api/v1/members/me/chatRooms/available?page=${availablePage - 1}`, {
					...axios.defaults,
					useAuth: true,
				})
				.then((res) => res.data),
			keepPreviousData: true,
	})
	const { isLoading: isChatAvailableLoading, chatAvailableData, isError: isChatAvailableError, chatAvailableError } = chatAvailableQuery;

	const chatExitedQuery = useQuery({
		queryKey: ["chatExited", exitedPage],
		queryFn: () =>
			instance
				.get(`/api/v1/members/me/chatRooms/exited?page=${exitedPage - 1}`, {
					...axios.defaults,
					useAuth: true,
				})
				.then((res) => res.data),
			keepPreviousData: true,
	})
	const { isLoading: isChatExitedLoading, chatExitedData, isError: isChatExitedError, chatExitedError } = chatExitedQuery;

	const availablePages = useMemo(
		() => chatAvailableQuery.data?.objData.totalPages ?? 0,
		[chatAvailableQuery.data?.objData.totalPages]
	)

	const exitedPages = useMemo(
		() => chatExitedQuery.data?.objData.totalPages ?? 0,
		[chatExitedQuery.data?.objData.totalPages]
	)

	if (isChatAvailableLoading || isChatExitedLoading || isLoading) {
		return <div>loading</div>
	}

	if (isChatAvailableError || isChatExitedError || isError) {
		return <div>Error</div>
	}

	return (
		<div className="flex h-screen">
			<div className={"flex flex-col w-full gap-5 px-5"}>
				{user.objData.role === "HOST" &&
					<Tabs aria-label="Options">
						<Tab key="진행 중" title="진행 중">
							{availablePages === 0 && <div>문의내역이 없습니다.</div>}
							{isChatAvailableLoading &&
								Array(4)
									.fill(0)
										.map((_, index) => {
											return <Skeleton key={index} height={200}/>
										})
							}
							{chatAvailableQuery.isSuccess &&
								chatAvailableQuery.data?.objData.content.map((chatRoom, index) => {
									return (
										<ChatRoomCard chatRoom={chatRoom} index={index} />
									)
								})
							}
							{availablePages > 0 ? (
									<div className='flex w-full justify-center mt-10'>
										<Pagination
												isCompact
												showControls
												showShadow
												color='primary'
												page={availablePage}
												total={availablePages}
												onChange={(availablePage) => setPage(availablePage)}
										/>
									</div>
								) : null
							}
						</Tab>
						<Tab key="종료" title="종료">
							{exitedPages === 0 && <div>문의내역이 없습니다.</div>}
							{isChatExitedLoading &&
								Array(4)
									.fill(0)
										.map((_, index) => {
											return <Skeleton key={index} height={200}/>
										})
							}
							{chatExitedQuery.isSuccess &&
								chatExitedQuery.data?.objData.content.map((chatRoom, index) => {
									return (
										<ChatRoomCard chatRoom={chatRoom} index={index} />
									)
								})
							}
							{exitedPages > 0 ? (
									<div className='flex w-full justify-center mt-10'>
										<Pagination
												isCompact
												showControls
												showShadow
												color='primary'
												page={exitedPage}
												total={exitedPages}
												onChange={(exitedPage) => setPage(exitedPage)}
										/>
									</div>
								) : null
							}
						</Tab>
					</Tabs>
				}
				{user.objData.role === "GUEST" &&
					<div>
						{availablePages === 0 && <div>문의내역이 없습니다.</div>}
						{isChatAvailableLoading &&
							Array(4)
								.fill(0)
									.map((_, index) => {
										return <Skeleton key={index} height={200}/>
									})
						}
						{chatAvailableQuery.isSuccess &&
							chatAvailableQuery.data?.objData.content.map((chatRoom, index) => {
								return (
									<ChatRoomCard chatRoom={chatRoom} index={index} />
								)
							})
						}
						{availablePages > 0 ? (
								<div className='flex w-full justify-center mt-10'>
									<Pagination
											isCompact
											showControls
											showShadow
											color='primary'
											page={availablePage}
											total={availablePages}
											onChange={(availablePage) => setPage(availablePage)}
									/>
								</div>
							) : null
						}
					</div>
				}
			</div>
		</div>
	)
}
