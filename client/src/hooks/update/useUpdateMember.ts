import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/api";

export function useUpdateMember(conversationId: string) {
  const mute = useMutation({
    mutationFn: async (mutedUntil: string) =>
      api.patch(`/conversations/${conversationId}/members/me/mute`, {
        muted_until: mutedUntil,
      }),
  });

  const unmute = useMutation({
    mutationFn: async () =>
      api.patch(`/conversations/${conversationId}/members/me/unmute`),
  });

  const archive = useMutation({
    mutationFn: async () =>
      api.patch(`/conversations/${conversationId}/members/me/archive`),
  });

  const unarchive = useMutation({
    mutationFn: async () =>
      api.patch(`/conversations/${conversationId}/members/me/unarchive`),
  });

  const nickname = useMutation({
    mutationFn: async (nickname: string) =>
      api.patch(`/conversations/${conversationId}/members/me/nickname`, {
        nickname,
      }),
  });

  return { mute, unmute, archive, unarchive, nickname };
}
