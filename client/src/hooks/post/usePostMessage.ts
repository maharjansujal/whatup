import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { SendMessagePayload } from "../../types/message";

export function usePostMessage() {
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
