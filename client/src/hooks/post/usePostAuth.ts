import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import type { LoginDto, RegisterDto, User } from "../../types/user";
import socket from "../../socket/socket";
import { useAlert } from "../../components/shared/alert/useAlert";

export function usePostAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const alert = useAlert();

  const registerMutation = useMutation<User, Error, RegisterDto>({
    mutationFn: async (data) => {
      const res = await api.post("/auth/register", data);
      return res.data;
    },
    onSuccess: () => {
      alert.success("User registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/login");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout"); // backend clears cookie
    },
    onSuccess: () => {
      socket.disconnect();
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
      socket.connect();
      await queryClient.cancelQueries({ queryKey: ["auth-user"] });
      queryClient.setQueryData(["auth-user"], user);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert.success("Logged in successfully");
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
