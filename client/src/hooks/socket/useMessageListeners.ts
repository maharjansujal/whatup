import { useQueryClient } from "@tanstack/react-query";
import { useChatSocket } from "../../context/SocketContext";
import { useEffect } from "react";
import type { Message } from "../../types/message";

export function useMessageListeners() {
  const queryClient = useQueryClient();
  const { socket, activeUser } = useChatSocket();

  useEffect(() => {
    if (!socket) return;

    const chatId = activeUser?.id;

    const handleNewMessage = (message: Message) => {
      queryClient.setQueryData(["messages", chatId], (old: Message[] = []) => {
        const messageExists = old.some((msg) => msg.id === message.id);
        if (messageExists) return old;
        return [...old, message];
      });

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    };
    const handleMessageUpdated = (updatedMessage: Message) => {
      queryClient.setQueryData(["messages", chatId], (old: Message[] = []) => {
        return old.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg,
        );
      });
    };

    const handleMessageSeenUpdate = (updatedMessage: Message) => {
      const conversationId = updatedMessage.receiver_id;

      queryClient.setQueryData(
        ["messages", conversationId],
        (old: Message[] = []) => {
          return old.map((msg) =>
            msg.id === updatedMessage.id ? { ...msg, status: "seen" } : msg,
          );
        },
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("messageSeenUpdate", handleMessageSeenUpdate);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("messageSeenUpdate", handleMessageSeenUpdate);
    };
  }, [socket, activeUser, queryClient]);
}
