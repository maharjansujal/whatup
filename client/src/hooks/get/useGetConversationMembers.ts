import { useQuery } from "@tanstack/react-query";
import type { Member } from "../../types/member";
import { api } from "../../api/api";

export function useGetConversationMembers(conversationId: string) {
  return useQuery<Member[]>({
    queryKey: ["conversationMembers", conversationId],
    queryFn: async () => {
      const res = await api.get(`/conversations/${conversationId}/members`);
      return res.data;
    },
  });
}
