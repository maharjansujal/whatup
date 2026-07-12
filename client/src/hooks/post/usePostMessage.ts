import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Message, MessageType } from "../../types/message";
import { useAlert } from "../../components/shared/alert/useAlert";
import type { AxiosError } from "axios";

interface Payload {
  conversationId: string;
  content: string;
  type?: MessageType;
  files?: File[];
}

export function usePostMessage() {
  const alert = useAlert();
  return useMutation<Message, AxiosError<{ message: string }>, Payload>({
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
    onError: (error: AxiosError<{ message: string }>) => {
      alert.error(error.response?.data.message ?? "Failed to send message");
    },
  });
}
