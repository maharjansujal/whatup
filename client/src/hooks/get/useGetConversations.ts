import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Conversation } from "../../types/conversation";

export function useGetConversations(userId: string) {
  return useQuery<Conversation[]>({
    queryKey: ["conversations", userId],
    queryFn: async () => {
      const res = await api.get(`/conversations?userId=${userId}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 2, // cache for 2 minutes
  });
}
