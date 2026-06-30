import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { User } from "../../types/user";

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await api.get("/users/me");
      return data.result as User | null;
    },
    retry: false,
  });

  return {
    ...query,
    currentUser: query.data,
  };
}
