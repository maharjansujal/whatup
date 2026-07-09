import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Message } from "../../types/message";
import { useAlert } from "../../components/shared/alert/useAlert";

interface DeleteMessageDto {
  messageId: string;
  conversationId: string;
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  const alert = useAlert();

  return useMutation<Message, Error, DeleteMessageDto>({
    mutationFn: async ({ messageId }) => {
      const res = await api.delete(`/conversations/messages/${messageId}`);
      return res.data.data ?? res.data;
    },
    onSuccess: (deletedMessage, { conversationId }) => {
      queryClient.setQueryData<Message[]>(
        ["messages", conversationId],
        (old) =>
          old?.map((m) => (m.id === deletedMessage.id ? deletedMessage : m)) ??
          old,
      );
      alert.success("Message deleted successfully");
    },
  });
}
