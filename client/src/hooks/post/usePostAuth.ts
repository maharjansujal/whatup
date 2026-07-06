import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import type { LoginDto, RegisterDto, User } from "../../types/user";

export function usePostAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const registerMutation = useMutation<User, Error, RegisterDto>({
    mutationFn: async (data) => {
      const res = await api.post("/auth/register", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/login");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout"); // backend clears cookie
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth-user"] });
      queryClient.removeQueries({ queryKey: ["users"] });

      // Redirect to login
      navigate("/login");
    },
  });

  const loginMutation = useMutation<User, Error, LoginDto>({
    mutationFn: async (data) => {
      const res = await api.post("/auth/login", data);
      return res.data.user;
    },
    onSuccess: async (user) => {
      await queryClient.cancelQueries({ queryKey: ["auth-user"] });
      queryClient.setQueryData(["auth-user"], user);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/");
    },
  });
  return {
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error,
    isLogoutError: logoutMutation.isError,
  };
}
