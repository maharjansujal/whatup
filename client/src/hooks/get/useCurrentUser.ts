import { useQuery } from "@tanstack/react-query";
import type { User } from "../../types/user";
import { api } from "../../api/api";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await api.get(`${VITE_API_URL}/users/me`);
      return data.result;
    },
    retry: false,
  });
}
