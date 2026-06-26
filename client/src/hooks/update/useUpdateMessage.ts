import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../instance/api";

type UpdateMessageData = {
  messageId: number;
  content: string;
};

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, content }: UpdateMessageData) => {
      const { data } = await api.patch(`/messages/${messageId}`, {
        content,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
    },
  });
}
