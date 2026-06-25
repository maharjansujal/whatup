import { useQuery, useMutation } from "@tanstack/react-query";

export interface User {
  id: number;
  username: string;
  name: string;
  image?: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
}

const API_URL = "http://localhost:5000";

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      return data.result || [];
    },
  });
};

export const useConversation = (
  senderId: number | null,
  receiverId: number | null,
) => {
  return useQuery<Message[]>({
    queryKey: ["messages", senderId, receiverId],
    queryFn: async () => {
      if (!senderId || !receiverId) return [];

      const params = new URLSearchParams({
        senderId: String(senderId),
        receiverId: String(receiverId),
      });

      const res = await fetch(`${API_URL}/messages?${params}`);
      const data = await res.json();
      return Object.values(data).filter(
        (item) =>
          typeof item === "object" && item !== null && "content" in item,
      ) as Message[];
    },
    enabled: !!senderId && !!receiverId,
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (payload: {
      senderId: number;
      receiverId: number;
      content: string;
    }) => {
      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
  });
};
