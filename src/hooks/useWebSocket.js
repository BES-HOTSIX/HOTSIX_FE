import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export const useWebSocket = (url, topic) => {
  const [messages, setMessages] = useState([]);
  const stompClient = useRef(null);

  useEffect(() => {
    // SockJS와 Stomp 클라이언트 설정
    const socket = new SockJS(url);
    stompClient.current = Stomp.over(socket);
    
    stompClient.current.connect({}, frame => {
      console.log('Connected: ' + frame);
      stompClient.current.subscribe(topic, message => {
        // 메시지 수신 시 상태 업데이트
        setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
      });
    }, error => {
      console.error('Connection error: ', error);
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
        console.log("Disconnected");
      }
    };
  }, [url, topic]);

  const sendMessage = (messageObj) => {
	console.log(messageObj);
	const messageText = messageObj.message;
    if (messageText.trim() !== '' && stompClient.current) {
      // 메시지 전송
      stompClient.current.send(topic, {}, JSON.stringify({ messageText }));
    }
  };

  return { messages, sendMessage };
};
