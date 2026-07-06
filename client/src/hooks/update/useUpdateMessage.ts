import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Message } from "../../types/message";

interface UpdateMessageDto {
  messageId: string;
  conversationId: string;
  content: string;
}

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, UpdateMessageDto>({
    mutationFn: async ({ messageId, content }) => {
      const res = await api.patch(`/conversations/messages/${messageId}`, {
        content,
      });
      return res.data.data ?? res.data;
    },
    onSuccess: (updatedMessage, { conversationId }) => {
      queryClient.setQueryData<Message[]>(
        ["messages", conversationId],
        (old) =>
          old?.map((m) => (m.id === updatedMessage.id ? updatedMessage : m)) ??
          old,
      );
    },
  });
}
