'use client'

import { Card, CardBody } from "@nextui-org/react"
import { useRouter } from 'next/navigation'
import { Avatar, Chip } from "@nextui-org/react";
import { format } from 'date-fns';

export default function ChatRoomCard({ chatRoom, index }) {
	const router = useRouter();

	return (
		<Card key={index} className={"!overflow-visible mb-5 w-full"} isPressable isHoverable disableAnimation onPress={() => router.push(`/chat/${chatRoom.chatRoomId}`)}>
			<CardBody>
				<div className={"flex gap-5"}>
					<div className={"flex items-center justify-center relative w-1/6 rounded-md overflow-hidden"}>
							<Avatar src={chatRoom.contactImage} className={"w-24 h-24"} />
					</div>
					<div className={"flex flex-col justify-between w-full"}>
						<div className={"flex justiy-between items-center w-full"}>
							<div className={"text-2xl"}>{chatRoom.contactNickname}</div>
							{chatRoom.latestDate &&
								<div className="text-base text-gray-500 ml-auto mr-3">{format(new Date(chatRoom.latestDate), 'MM/dd HH:mm')}</div>
							}
							{!chatRoom.latestDate &&
								<div className="text-base text-gray-500 ml-auto mr-3">{format(new Date(chatRoom.createdAt), 'MM/dd HH:mm')}</div>
							}
						</div>
						<div className={"flex justiy-end items-center w-full"}>
							{chatRoom.left &&
								<Chip className="ml-auto mr-3" size="md" color="danger">채팅 종료</Chip>
							}
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}
