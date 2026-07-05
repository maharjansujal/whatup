import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Conversation } from "../../types/conversation";

interface Payload {
  name: string;
  memberIds: string[];
}

export function usePostGroupConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, Payload>({
    mutationFn: async ({ name, memberIds }) => {
      const res = await api.post("/conversations/group", {
        name,
        memberIds,
      });
      return res.data;
    },
    onSuccess: (newConversation) => {
      // prepend new group to conversations list
      queryClient.setQueryData<Conversation[]>(
        ["conversations"],
        (old = []) => [newConversation, ...old],
      );
    },
  });
}
