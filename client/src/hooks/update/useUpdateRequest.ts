import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { ConversationRequest } from "../../types/request";

export function useAcceptRequest() {
  const queryClient = useQueryClient();

  return useMutation<ConversationRequest, Error, { requestId: string }>({
    mutationFn: async ({ requestId }) => {
      const res = await api.patch(`/requests/${requestId}/accept`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests", "incoming"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useDeclineRequest() {
  const queryClient = useQueryClient();

  return useMutation<ConversationRequest, Error, { requestId: string }>({
    mutationFn: async ({ requestId }) => {
      const res = await api.patch(`/requests/${requestId}/decline`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests", "incoming"] });
    },
  });
}
