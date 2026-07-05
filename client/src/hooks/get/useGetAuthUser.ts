import { useQuery } from "@tanstack/react-query";
import type { User } from "../../types/user";
import { api } from "../../api/api";
import axios from "axios";

export function useGetAuthUser() {
  return useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        const res = await api.get("/users/me"); // backend reads cookie
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false, // don’t retry endlessly if unauthorized
  });
}
