import { useMutation } from "@tanstack/react-query";
import { api } from "../../instance/api";

interface SendMessagePayload {
  receiverId: number;
  content: string;
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const res = await api.post("/messages", payload);
      return res.data;
    },
  });
}
