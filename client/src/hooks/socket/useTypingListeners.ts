import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useChatSocket } from "../../context/SocketContext";
import type { Message } from "../../types/message";

export function useTypingListeners() {
  const queryClient = useQueryClient();
  const { socket, activeUser, setIsTyping } = useChatSocket();

  useEffect(() => {
    if (!socket) return;

    // Switch all 'sent' statuses to 'delivered' when a bulk delivery acknowledgment arrives
    const handleBulkDelivery = ({ receiverId }: { receiverId: number }) => {
      if (activeUser && activeUser.id === receiverId) {
        queryClient.setQueryData(
          ["messages", receiverId],
          (oldMessages: Message[] = []) => {
            return oldMessages.map((msg) =>
              msg.status === "sent" ? { ...msg, status: "delivered" } : msg,
            );
          },
        );
      }
    };

    const handleUserTyping = ({ senderId }: { senderId: number }) => {
      if (activeUser && senderId === activeUser.id) {
        setIsTyping(true);
      }
    };

    const handleUserStoppedTyping = ({ senderId }: { senderId: number }) => {
      if (activeUser && senderId === activeUser.id) {
        setIsTyping(false);
      }
    };

    socket.on("messagesDeliveredBulk", handleBulkDelivery);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.off("messagesDeliveredBulk", handleBulkDelivery);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [socket, activeUser, queryClient, setIsTyping]);
}
