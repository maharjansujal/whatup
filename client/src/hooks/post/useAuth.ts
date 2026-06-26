import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../instance/api";
import { useNavigate } from "react-router-dom";

type LoginPayload = {
  username: string;
  password: string;
};

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const registerUserMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post("/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/login");
    },
  });

  const loginUserMutation = useMutation({
    mutationFn: async ({ username, password }: LoginPayload) => {
      const res = await api.post("/users/login", {
        username,
        password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      // Seeds/updates TanStack cache for immediate global access
      queryClient.setQueryData(["auth-user"], data?.user);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.setQueryData(["auth-user"], null);
    window.location.href = "/login";
  };

  return {
    registerUser: registerUserMutation.mutateAsync,
    registerUserMutation,
    isRegisteringUser: registerUserMutation.isPending,
    registerError: registerUserMutation.error,
    isRegisterError: registerUserMutation.isError,

    loginUser: loginUserMutation.mutateAsync,
    loginUserMutation,
    isLoggingIn: loginUserMutation.isPending,
    loginError: loginUserMutation.error,
    isLoginError: loginUserMutation.isError,

    logout,
  };
}
