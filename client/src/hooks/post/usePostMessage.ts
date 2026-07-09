import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Message, MessageType } from "../../types/message";

interface Payload {
  conversationId: string;
  content: string;
  type?: MessageType;
  files?: File[];
}

export function usePostMessage() {
  return useMutation<Message, Error, Payload>({
    mutationFn: async ({ conversationId, type = "text", content, files }) => {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("type", type);
      files?.forEach((file) => formData.append("files", file));
      const res = await api.post(
        `/conversations/${conversationId}/messages`,
        formData,
      );
      return res.data;
    },
  });
}
