import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Message } from "../../types/message";

interface Payload {
  conversationId: string;
  content: string;
}

export function usePostMessage() {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, Payload>({
    mutationFn: async ({ conversationId, content }) => {
      const res = await api.post(`/conversations/${conversationId}/messages`, {
        content,
      });
      return res.data;
    },
    onSuccess: (newMessage, { conversationId }) => {
      // update messages cache
      queryClient.setQueryData<Message[]>(
        ["messages", conversationId],
        (old = []) => [...old, newMessage],
      );
      // update conversations cache (last message preview)
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
