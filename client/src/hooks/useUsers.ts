import { useQuery } from "@tanstack/react-query";
import { api } from "../instance/api";
import type { User } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL;

export const useUsers = () => {
  const getAllUsersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/users`);
      return res.data.result || [];
    },
  });

  return {
    users: getAllUsersQuery.data,
    isUsersLoading: getAllUsersQuery.isLoading,
  };
};
