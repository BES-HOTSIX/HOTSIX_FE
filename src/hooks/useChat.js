import { useQuery } from "@tanstack/react-query";
import axios from "@/config/axios-config";

/**  채팅방 정보 */
const fetchChatRoomInfo = async (roomId) => {
	const res = await axios.get(`api/v1/chat/info/${roomId}`,
		{
			...axios.defaults,
			useAuth: true
		}
	);

	return res.data;
};

export const useChatRoomInfo = (roomId) => {
	const {
		data: chatRoom,
		isChatLoading,
		isChatFetching,
		isChatError,
		chatError,
	} = useQuery({
		queryKey: ["chatRoomInfo", roomId],
		queryFn: () => fetchChatRoomInfo(roomId),
	});

	return { chatRoom, isChatLoading, isChatFetching, isChatError, chatError };
};

/**  채팅 메세지 리스트 */
const fetchChatMessageList = async (roomId) => {
	const res = await axios.get(`api/v1/chat/messages/${roomId}`,
		{
			...axios.defaults,
			useAuth: true
		}
	);

	return res.data;
};

export const useChatMessageList = (roomId) => {
	const {
		data: chatMessages,
		isMsgLoading,
		isMsgFetching,
		isMsgError,
		msgError,
	} = useQuery({
		queryKey: ["chatMessageList", roomId],
		queryFn: () => fetchChatMessageList(roomId),
	});

	return { chatMessages, isMsgLoading, isMsgFetching, isMsgError, msgError };
};
