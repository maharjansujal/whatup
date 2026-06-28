import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "../../api/api";
import { useChatSocket } from "../../context/SocketContext";
import type { Message } from "../../types/message";

export function useGetMessages(receiverId: number | undefined) {
  const { setMessages } = useChatSocket();

  const query = useQuery<Message[]>({
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
