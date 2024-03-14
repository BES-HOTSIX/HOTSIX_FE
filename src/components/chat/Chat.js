'use client'

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useUser } from '@/hooks/useUser';
import { useChatRoomInfo, useChatMessageList } from '@/hooks/useChat';
import { format } from 'date-fns';
import { FiMoreVertical, FiChevronLeft } from 'react-icons/fi';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import axios from "axios";

export default function Chat({ id }) {
	const [stompClient, setStompClient] = useState(null);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const messagesContainerRef = useRef(null);
	const { user, isLoading, isError } = useUser();
	const { chatRoom, isChatLoading, isChatError } = useChatRoomInfo(id);
	const { chatMessages, isMsgLoading, isMsgError } = useChatMessageList(id);
	const router = useRouter();

	useEffect(() => {
		if (chatMessages && chatMessages.objData && chatMessages.objData.messageList) {
			setMessages(chatMessages.objData.messageList);
		}
	}, [chatMessages]);

	useEffect(() => {
		const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`);
		const client = Stomp.over(socket);
		client.connect({}, (frame) => {
			console.log('Connected: ' + frame);
			client.subscribe(`/topic/messages/${id}`, (message) => {
				console.log('Received: ' + message.body);
				setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
			});
		});
		setStompClient(client);

		return () => {
			if (client && client.connected) {
				client.disconnect();
			}
		};
	}, []);

	useEffect(() => {
		// 채팅 메시지 컨테이너의 스크롤 높이를 최신 값으로 설정하여 스크롤을 아래로 이동
		const messagesContainer = messagesContainerRef.current;
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}, [messages]);

	if (isChatLoading || isLoading || isMsgLoading) {
		return <div className="h-[60vh] mt-32">loading</div>;
	}

	if (isChatError || isError || isMsgError || !user?.objData || !chatRoom?.objData || !chatMessages?.objData) {
		return <div className="h-[60vh] mt-32">Error</div>;
	}

	const handleExitChatRoom = async () => {
		try {
			const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/chat/${id}`);

			if (response.status >= 400) {
				throw new Error('Network response was not ok')
			}

			router.back();
		} catch (error) {
				console.error('Failed to exit chat room:', error);
		}
	};

	const sendMessage = () => {
		if (stompClient && stompClient.connected && message != '') {
			const chatMessage = {
				content: message,
				sender: user.objData.nickname,
			};
			stompClient.send(`/app/chat.sendMessage/${id}`, {}, JSON.stringify(chatMessage));
			setMessage('');
		}
	}

	const contactTo = user.objData.nickname === chatRoom.objData.userNickname ? chatRoom.objData.hostNickname : chatRoom.objData.userNickname;

	return (
		<div className="flex flex-col h-[80vh] max-w-2xl mx-auto border border-gray-200 bg-gray-100 mt-32">
			<div className="flex flex-row p-4 text-lg font-semibold justify-between items-center">
				<div>
					<Button
						color=""
						variant="light"
						className="min-w-10"
						disableAnimation
						onClick={() => router.back()}
					>
						<FiChevronLeft />
					</Button>
				</div>
				<div>
					{contactTo}
				</div>
				<div className="min-w-10">
					{user.objData.role === 'GUEST' && (
						<Dropdown>
							<DropdownTrigger>
								<Button 
									color=""
									variant="light"
									className="min-w-10"
									disableAnimation
								>
									<FiMoreVertical />
								</Button>
							</DropdownTrigger>
							<DropdownMenu aria-label="Static Actions">
								<DropdownItem key="delete" className="text-danger" color="danger" onClick={handleExitChatRoom}>
									퇴장하기
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					)}
				</div>
			</div>
			<hr className="border-gray-200" />
			<div ref={messagesContainerRef} className="messages-container flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((msg, idx) => (
					// 현재 사용자가 보낸 메시지인지 판단하여 ChatMessage 컴포넌트에 전달
					<ChatMessage key={idx} msg={msg} isCurrentUser={msg.sender === user.objData.nickname} />
				))}
			</div>
			<div className="p-4 border-t border-gray-200 bg-white flex items-center">
				<textarea
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyUp={(e) => {
						if (e.key === 'Enter' && !e.shiftKey && message.trim() !== '') {
							e.preventDefault();
							sendMessage();
							setTimeout(() => setMessage(''), 0);
						}
					}}
					className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none ${chatRoom.objData.left ? 'bg-gray-200' : ''}`}
					placeholder={`${chatRoom.objData.left ? "채팅이 종료되었습니다." : "메세지를 입력하세요."}`}
					disabled={chatRoom.objData.left}
				/>
				<button
					onClick={sendMessage}
					className={`ml-4 px-5 py-2 ${chatRoom.objData.left ? 'bg-gray-500' : 'bg-blue-500'} text-white rounded-lg float-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${chatRoom.objData.left ? '' : 'hover:bg-blue-600'}`}
					disabled={chatRoom.objData.left}
				>
					Send
				</button>
			</div>
		</div>
	);
}

const ChatMessage = ({ msg, isCurrentUser }) => {
	// 현재 사용자가 보낸 메시지인지에 따라 다른 배경색 적용
	const messageStyle = isCurrentUser
		? "break-words p-2 rounded-lg bg-blue-100 border border-blue-200 max-w-xs ml-auto text-sm"
		: "break-words p-2 rounded-lg bg-white border border-gray-200 max-w-xs mr-auto text-sm";

	// timestamp를 Date 객체로 변환
	const date = new Date(msg.timestamp);
	// HH:mm 형식으로 시간 변환
	// const formattedTime = date.toLocaleTimeString('ko-KR', {
	// 	hour: '2-digit',
	// 	minute: '2-digit',
	// 	hour12: false // 24시간 형식
	// });
	// 메시지 시간을 'MM.DD HH:mm' 형식으로 형식화
	const formattedTime = format(date, 'MM/dd HH:mm');

	return (
		<div className={messageStyle}>
			<div className="text-xs text-gray-500" style={{ whiteSpace: 'pre-wrap' }}>{formattedTime}</div>
			<div style={{ whiteSpace: 'pre-wrap' }}>
				{msg.content}
			</div>
		</div>
	);
};