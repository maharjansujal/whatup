import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Mode, Status, User } from "../../types/user";

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: {
      status_mode: Mode;
      custom_status: Status | null;
    }) => {
      await api.put("/users/status", payload);
      return payload;
    },

    onSuccess: (payload) => {
      queryClient.setQueryData<User | null>(["current-user"], (oldUser) => {
        if (!oldUser) return null;

        return {
          ...oldUser,
          status_mode: payload.status_mode,
          custom_status: payload.custom_status,
        };
      });
    },
  });

  return {
    updateStatus: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
