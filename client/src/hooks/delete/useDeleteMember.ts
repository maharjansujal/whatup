import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/api";

export function useDeleteMember(conversationId: string, userId: string) {
  return useMutation({
    mutationFn: async () =>
      api.delete(`/conversations/${conversationId}/members/${userId}`),
  });
}
