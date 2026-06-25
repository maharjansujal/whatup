import { useQuery } from "@tanstack/react-query";
import { api } from "../instance/api";

const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  id: number;
  username: string;
  name: string;
  image?: string;
}

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
