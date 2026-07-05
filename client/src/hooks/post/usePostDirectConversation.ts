import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Conversation } from "../../types/conversation";
import { api } from "../../api/api";

interface Payload {
  userId: string;
}

export function usePostDirectConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, Payload>({
    mutationFn: async ({ userId }) => {
      const res = await api.post("/conversations/direct", { userId });
      return res.data;
    },
    onSuccess: (newConversation) => {
      queryClient.setQueryData<Conversation[]>(
        ["conversations"],
        (old = []) => {
          // avoid duplicates
          const exists = old.find((c) => c.id === newConversation.id);
          return exists ? old : [newConversation, ...old];
        },
      );
    },
  });
}
