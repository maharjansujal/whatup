import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";

export function useUpdateMember(conversationId: string, userId: string) {
  const queryClient = useQueryClient();
  const mute = useMutation({
    mutationFn: async (mutedUntil: string) =>
      api.patch(`/conversations/${conversationId}/members/me/mute`, {
        muted_until: mutedUntil,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", userId],
      });
    },
  });

  const unmute = useMutation({
    mutationFn: async () =>
      api.patch(`/conversations/${conversationId}/members/me/unmute`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", userId],
      });
    },
  });

  const archive = useMutation({
    mutationFn: async () =>
      api.patch(`/conversations/${conversationId}/members/me/archive`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", userId],
      });
    },
  });

  const unarchive = useMutation({
    mutationFn: async () =>
      api.patch(`/conversations/${conversationId}/members/me/unarchive`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", userId],
      });
    },
  });

  const nickname = useMutation({
    mutationFn: async (nickname: string) =>
      api.patch(`/conversations/${conversationId}/members/me/nickname`, {
        nickname,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", userId],
      });
    },
  });

  return { mute, unmute, archive, unarchive, nickname };
}
