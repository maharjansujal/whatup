import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/api";

export function useDeleteMember(conversationId: string, userId: string) {
  const removeMemberMutation = useMutation({
    mutationFn: async () =>
      api.delete(`/conversations/${conversationId}/members/${userId}`),
  });

  const leaveGroupMutation = useMutation({
    mutationFn: async () =>
      api.delete(`/conversations/${conversationId}/members/leave`),
  });

  return {
    removeMember: removeMemberMutation.mutate,
    isRemovingMember: removeMemberMutation.isPending,

    leaveGroup: leaveGroupMutation.mutate,
    isLeavingGroup: leaveGroupMutation.isPending,
  };
}
