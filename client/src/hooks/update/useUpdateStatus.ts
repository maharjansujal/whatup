import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { UserStatus } from "../../types/user";

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["users"],
    });

    queryClient.invalidateQueries({
      queryKey: ["auth-user"],
    });
  };

  const update = useMutation({
    mutationFn: async (data: UserStatus) => {
      const res = await api.put("/users/status", data);
      return res.data;
    },

    onSuccess: invalidate,
  });

  const clear = useMutation({
    mutationFn: async () => {
      await api.delete("/users/status");
    },

    onSuccess: invalidate,
  });

  return {
    updateStatus: update.mutateAsync,
    clearStatus: clear.mutateAsync,

    isUpdatingStatus: update.isPending,
    isClearingStatus: clear.isPending,
  };
}
