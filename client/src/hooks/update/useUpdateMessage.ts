import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../instance/api";
import type { MessageItem } from "../get/useFetchMessages";

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
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["messages", variables.receiverId],
        (old: MessageItem[] = []) =>
          old.map((msg) =>
            msg.id === variables.messageId
              ? { ...msg, content: variables.content }
              : msg,
          ),
      );
    },
  });
}
