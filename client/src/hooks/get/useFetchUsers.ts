import { useQuery } from "@tanstack/react-query";
import { api } from "../../instance/api";

export interface UserItem {
  id: number;
  name: string;
  username: string;
  image?: string;
  created_at: string;
  last_message?: string | null;
  last_message_sender_id?: number | null;
  last_message_status?: "sent" | "delivered" | "seen";
  last_message_time?: string | null;
}

export function useFetchUsers() {
  // Extract current user from localStorage to exclude them from the list
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  return useQuery<UserItem[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data.result;
    },
    // Filter out the logged-in user from the returned list array
    select: (users) => users.filter((u) => u.id !== Number(currentUser?.id)),
  });
}
