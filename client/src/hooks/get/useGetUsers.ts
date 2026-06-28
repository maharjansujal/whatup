import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { UserMessage } from "../../types/user";

export function useGetUsers() {
  // Extract current user from localStorage to exclude them from the list
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  return useQuery<UserMessage[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data.result;
    },
    // Filter out the logged-in user from the returned list array
    select: (users) => users.filter((u) => u.id !== Number(currentUser?.id)),
  });
}
