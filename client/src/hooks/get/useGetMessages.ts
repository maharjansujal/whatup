import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Message } from "../../types/message";

export function useGetMessages(conversationId: string) {
  return useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await api.get(`/conversations/${conversationId}/messages`);
      return res.data;
    },
    enabled: !!conversationId, // only run when we have a valid id
    staleTime: 1000 * 30, // cache for 30 seconds
  });
}
