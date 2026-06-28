import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "../../instance/api";
import { useChatSocket } from "../../context/SocketContext";

export interface MessageItem {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  updated_at?: string;
  is_seen: boolean;
}

export function useFetchMessages(receiverId: number | undefined) {
  const { setMessages } = useChatSocket();

  const query = useQuery<MessageItem[]>({
    queryKey: ["messages", receiverId],
    queryFn: async () => {
      const res = await api.get("/messages", {
        params: { receiverId },
      });
      return res.data.messages;
    },
    enabled: !!receiverId, // Only execute if a target contact is selected
  });

  useEffect(() => {
    if (query.data) {
      setMessages(query.data);
    }
  }, [query.data, setMessages]);

  return query;
}
