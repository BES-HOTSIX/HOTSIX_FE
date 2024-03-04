'use client'

import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export default function ChatRoom() {
		const [messages, setMessages] = useState([]);
		const [text, setText] = useState('');

		useEffect(() => {
				// SockJS와 Stomp 클라이언트 설정
				const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`);
				const stompClient = Stomp.over(socket);

				stompClient.connect({}, function(frame) {
						console.log('Connected: ' + frame);

						stompClient.subscribe('/topic/messages', function(messageOutput) {
								setMessages(prevMessages => [...prevMessages, JSON.parse(messageOutput.body).content]);
						});
				});

				return () => {
						stompClient.disconnect(() => {
								console.log("Disconnected");
						});
				};
		}, []);

		const sendMessage = () => {
				if (text.trim() !== "") {
						const stompClient = Stomp.client(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/chat`);
						stompClient.connect({}, function() {
								stompClient.send("/app/chat", {}, JSON.stringify({'content': text}));
						});
						setText('');
				}
		};

		return (
				<div>
						<div>
								{messages.map((msg, index) => (
										<div key={index}>{msg}</div>
								))}
						</div>
						<input type="text" value={text} onChange={(e) => setText(e.target.value)} />
						<button onClick={sendMessage}>Send</button>
				</div>
		);
}
