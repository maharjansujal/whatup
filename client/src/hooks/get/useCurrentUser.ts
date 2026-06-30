import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data } = await api.get(`/users/me`);
      return data.result;
    },
    retry: false,
  });
}
