import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let subscription = null;

export const connectWebSocket = (url, id, onMessageReceived) => {
	if (!stompClient || !stompClient.connected) {
		const socket = new SockJS(url);
		stompClient = Stomp.over(socket);

		stompClient.connect({}, () => {
			console.log('Websocket Connected');
			subscription = stompClient.subscribe(`/topic/messages/${id}`, (message) => {
				console.log('Received: ' + message.body);
				onMessageReceived(JSON.parse(message.body));
			});
		});
	}

	return { stompClient };
};

export const disconnectWebSocket = () => {
	if (stompClient && stompClient.connected) {
		stompClient.disconnect(() => {
			console.log('Websocket disconnected');
		});
		stompClient = null;
	}

	if (subscription) {
		subscription.unsubscribe();
		subscription = null;
	}
};
