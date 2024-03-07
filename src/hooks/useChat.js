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
