import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { User } from "../../types/user";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const updateAvatar = useMutation<User, Error, { avatar: File }>({
    mutationFn: async ({ avatar }) => {
      const formData = new FormData();

      formData.append("avatar", avatar);

      const res = await api.patch("/users/me/avatar", formData);

      return res.data.data ?? res.data;
    },

    onSuccess: (user) => {
      queryClient.setQueryData(["auth-user"], user);
    },
  });

  const updatePassword = useMutation<
    User,
    Error,
    {
      currentPassword: string;
      newPassword: string;
    }
  >({
    mutationFn: async (data) => {
      const res = await api.patch("/users/me/password", data);
      return res.data.data ?? res.data;
    },

    onSuccess: (user) => {
      queryClient.setQueryData(["auth-user"], user);
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
