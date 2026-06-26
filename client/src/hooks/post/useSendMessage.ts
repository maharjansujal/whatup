import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../instance/api";

interface SendMessagePayload {
  receiverId: number;
  content: string;
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const res = await api.post("/messages", payload);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.receiverId],
      });
    },
  });
}
