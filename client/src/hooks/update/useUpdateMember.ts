import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/api";

export function useUpdateMember(conversationId: string) {
  const mute = useMutation({
    mutationFn: async (mutedUntil: string) =>
      api.patch(`/conversations/${conversationId}/members/me/mute`, {
        muted_until: mutedUntil,
      }),
  });

  const archive = useMutation({
    mutationFn: async () =>
      api.patch(`/conversations/${conversationId}/members/me/archive`),
  });

  const nickname = useMutation({
    mutationFn: async (nickname: string) =>
      api.patch(`/conversations/${conversationId}/members/me/nickname`, {
        nickname,
      }),
  });

  return { mute, archive, nickname };
}
