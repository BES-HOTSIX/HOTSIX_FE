'use client'

import { useEffect, useState, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function Chat({ roomId }) {
	const [stompClient, setStompClient] = useState(null);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`);
		const client = Stomp.over(socket);

		// 연결 헤더에 roomId와 인증 정보 추가
		const connectHeaders = {
			roomId: roomId,
			useAuth: true
		};

		client.connect(connectHeaders, (frame) => {
			console.log('Connected: ' + frame);
			client.subscribe('/topic/messages', (message) => {
				console.log('Received: ' + message.body);
				setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
			});
		});
		setStompClient(client);
	}, []);

	const sendMessage = () => {
		if (stompClient && stompClient.connected) {
			const chatMessage = {
				content: message,
				type: 'CHAT',
			};
			stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
			setMessages((prevMessages) => [...prevMessages, chatMessage]);
			setMessage('');
		}
	};

	return (
		<div className="flex flex-col h-[80vh] max-w-2xl mx-auto border border-gray-300 mt-32">
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((msg, idx) => (
					<div key={idx} className="break-words p-2 rounded-lg bg-blue-100 max-w-xs ml-auto">
						{msg.content}
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<div className="p-4 border-t border-gray-200 flex items-center">
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="텍스트를 입력하세요..."
				/>
				<button
					onClick={sendMessage}
					className="ml-4 px-5 py-2 bg-blue-500 text-white rounded-lg float-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-600"
				>
					Send
				</button>
			</div>
		</div>
	);
}
