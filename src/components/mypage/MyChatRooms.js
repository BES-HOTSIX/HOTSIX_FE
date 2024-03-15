'use client'

import instance from "@/config/axios-config"
import { Skeleton, Pagination, Tabs, Tab } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import axios from "axios"
import ChatRoomCard from "../chat/ChatRoomCard"
import { useUser } from '@/hooks/useUser';

export default function MyChatRooms() {
	const [page, setPage] = useState(1)
	const { user, isLoading, isError } = useUser();

	const chatAvailableQuery = useQuery({
		queryKey: ["chatRooms", page],
		queryFn: () =>
			instance
				.get(`/api/v1/members/me/chatRooms/available?page=${page - 1}`, {
					...axios.defaults,
					useAuth: true,
				})
				.then((res) => res.data),
			keepPreviousData: true,
	})
	const { isLoading: isChatAvailableLoading, chatAvailableData, isError: isChatAvailableError, chatAvailableError } = chatAvailableQuery;

	const chatExitedQuery = useQuery({
		queryKey: ["chatRooms", page],
		queryFn: () =>
			instance
				.get(`/api/v1/members/me/chatRooms/exited?page=${page - 1}`, {
					...axios.defaults,
					useAuth: true,
				})
				.then((res) => res.data),
			keepPreviousData: true,
	})
	const { isLoading: isChatExitedLoading, chatExitedData, isError: isChatExitedError, chatExitedError } = chatExitedQuery;

	const pages = useMemo(() => {
		// chatAvailableQuery가 데이터를 성공적으로 가져온 경우
		if (chatAvailableQuery.isSuccess && chatAvailableQuery.data) {
			return chatAvailableQuery.data.objData.totalPages ?? 0;
		}
		// chatExitedQuery가 데이터를 성공적으로 가져온 경우
		if (chatExitedQuery.isSuccess && chatExitedQuery.data) {
			return chatExitedQuery.data.objData.totalPages ?? 0;
		}
		// 둘 다 아닌 경우, 기본값으로 0을 설정
		return 0;
	}, [chatAvailableQuery.data, chatExitedQuery.data]);
	

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
							{pages === 0 && <div>문의내역이 없습니다.</div>}
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
						</Tab>
						<Tab key="종료" title="종료">
							{pages === 0 && <div>문의내역이 없습니다.</div>}
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
						</Tab>
					</Tabs>
				}
				{user.objData.role === "GUEST" &&
					<div>
						{pages === 0 && <div>문의내역이 없습니다.</div>}
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
					</div>
				}
				{pages > 0 ? (
						<div className='flex w-full justify-center mt-10'>
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
