import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../instance/api";

type RegisterPayload = {
  name: string;
  username: string;
  password: string;
  image?: File;
};

type LoginPayload = {
  username: string;
  password: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export function useAuth() {
  const queryClient = useQueryClient();
  const registerUserMutation = useMutation({
    mutationFn: async ({
      name,
      username,
      password,
      image,
    }: RegisterPayload) => {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("username", username);
      formData.append("password", password);

      if (image) {
        formData.append("image", image);
      }

      const res = await api.post(`${API_URL}/users/register`, formData);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const loginUserMutation = useMutation({
    mutationFn: async ({ username, password }: LoginPayload) => {
      const res = await api.post(`${API_URL}/users/login`, {
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  return {
    registerUser: registerUserMutation.mutateAsync,
    registerUserMutation,

    isRegisteringUser: registerUserMutation.isPending,
    registerError: registerUserMutation.error,

    loginUser: loginUserMutation.mutateAsync,
    loginUserMutation,
    isLoggingIn: loginUserMutation.isPending,
    loginError: loginUserMutation.error,
  };
}
