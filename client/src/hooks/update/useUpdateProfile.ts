import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { User } from "../../types/user";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const updateAvatar = useMutation<User, Error, { avatar_url: string }>({
    mutationFn: async (data) => {
      const res = await api.patch("/users/me", data);
      return res.data.data ?? res.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth-user"], user);
    },
  });

  const updatePassword = useMutation<
    void,
    Error,
    { current_password: string; new_password: string }
  >({
    mutationFn: async (data) => {
      await api.patch("/users/me/password", data);
    },
  });

  return {
    updateAvatar: updateAvatar.mutateAsync,
    isUpdatingAvatar: updateAvatar.isPending,
    avatarError: updateAvatar.error,

    updatePassword: updatePassword.mutateAsync,
    isUpdatingPassword: updatePassword.isPending,
    passwordError: updatePassword.error,
  };
}
