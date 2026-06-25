import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../instance/api";
import type { Message } from "../types/message";

const API_URL = import.meta.env.VITE_API_URL;

export interface SendMessagePayload {
  senderId: number;
  receiverId: number;
  content: string;
}

export const useMessages = (
  senderId: number | null,
  receiverId: number | null,
) => {
  const queryClient = useQueryClient();
  const queryKey = ["messages", senderId, receiverId];

  // Fetch messages
  const conversationQuery = useQuery<Message[]>({
    queryKey,
    queryFn: async () => {
      const res = await api.get(`${API_URL}/messages`, {
        params: {
          senderId,
          receiverId,
        },
      });
      // Fallback to empty array if messages is undefined
      return (res.data?.messages || []) as Message[];
    },
    enabled: !!senderId && !!receiverId,
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const token = localStorage.getItem("token");
      const res = await api.post(`${API_URL}/messages`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      // Structure incoming data to match the Message interface
      const savedMessage: Message = {
        id: data.id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        content: data.content,
        created_at: data.created_at,
      };

      // Instantly update the current conversation cache for immediate local feedback
      queryClient.setQueryData(
        queryKey,
        (oldMessages: Message[] | undefined) => [
          ...(oldMessages || []),
          savedMessage,
        ],
      );
    },
  });

  return {
    messages: conversationQuery.data || [],
    isMessagesLoading: conversationQuery.isLoading,
    messagesError: conversationQuery.error,

    sendMessage: sendMessageMutation.mutate,
    sendMessageAsync: sendMessageMutation.mutateAsync,
    isSendingMessage: sendMessageMutation.isPending,
    sendMessageError: sendMessageMutation.error,
  };
};
