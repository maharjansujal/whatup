import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Message } from "../../types/message";

export function useGetMessages(receiverId: number | undefined) {
  return useQuery<Message[]>({
    queryKey: ["messages", receiverId],
    queryFn: async () => {
      const res = await api.get("/messages", {
        params: { receiverId },
      });
      return res.data.messages;
    },
    enabled: !!receiverId, // Only execute if a target contact is selected
  });
}
