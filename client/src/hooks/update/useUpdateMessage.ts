import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Message } from "../../types/message";

type UpdateMessageData = {
  messageId: number;
  content: string;
  receiverId?: number;
};

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      content,
      receiverId,
    }: UpdateMessageData) => {
      console.log(content, receiverId);
      const { data } = await api.patch(`/messages/${messageId}`, {
        content,
        receiverId,
      });

      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["messages", variables.receiverId],
        (old: Message[] = []) =>
          old.map((msg) =>
            msg.id === variables.messageId
              ? { ...msg, content: variables.content }
              : msg,
          ),
      );
    },
  });
}
