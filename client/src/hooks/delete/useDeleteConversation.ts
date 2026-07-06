import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/api";

export function useDeleteConversation(conversationId: string) {
  return useMutation({
    mutationFn: async () => api.delete(`/conversations/${conversationId}`),
  });
}
