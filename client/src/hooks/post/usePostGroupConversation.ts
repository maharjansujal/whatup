import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Conversation } from "../../types/conversation";

interface Payload {
  name: string;
  member_ids: string[];
}

export function usePostGroupConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, Payload>({
    mutationFn: async ({ name, member_ids }) => {
      const res = await api.post("/conversations/group", {
        groupName: name,
        member_ids,
      });
      return res.data;
    },
    onSuccess: (newConversation) => {
      queryClient.setQueryData<Conversation[]>(
        ["conversations"],
        (old = []) => [newConversation, ...old],
      );
    },
  });
}
