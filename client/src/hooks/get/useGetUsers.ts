import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { User } from "../../types/user";

export function useGetUsers() {
  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data.data;
    },
  });

  const getUserById = (id: string) => usersQuery.data?.find((u) => u.id === id);

  return {
    users: usersQuery.data as User[],
    usersIsLoading: usersQuery.isLoading,
    getUserById,
  };
}
