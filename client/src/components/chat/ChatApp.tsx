import { useEffect, useRef, useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { useSocket } from "../../context/SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../layout/Sidebar";
import { ChatWindow } from "./ChatWindow";
import { useMessages } from "../../hooks/useMessages";
import type { Message } from "../../types/message";

export function ChatApp({ onLogout }: { onLogout: () => void }) {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const { users = [] } = useUsers();
  const [selectedUser, setSelectedUser] = useState<typeof currentUser | null>(
    null,
  );
  const [messageText, setMessageText] = useState("");
  const [typingUser, setTypingUser] = useState<number | null>(null);

  const { messages, sendMessage } = useMessages(
    currentUser.id,
    selectedUser?.id || null,
  );

  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages come in
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming Socket.io messages in real-time
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage: Message) => {
      if (
        (newMessage.sender_id === selectedUser?.id &&
          newMessage.receiver_id === currentUser.id) ||
        (newMessage.sender_id === currentUser.id &&
          newMessage.receiver_id === selectedUser?.id)
      ) {
        queryClient.setQueryData(
          ["messages", currentUser.id, selectedUser?.id],
          (oldMessages: Message[]) => [...(oldMessages || []), newMessage],
        );
      }
      if (newMessage.sender_id === selectedUser?.id) {
        setTypingUser(null);
      }
    });

    // Listen for typing signals
    socket.on("userTyping", ({ senderId }) => {
      if (senderId === selectedUser?.id) {
        setTypingUser(senderId);
      }
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      if (senderId === selectedUser?.id) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket, selectedUser, currentUser.id, queryClient]);

  const handleSend = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    const payload = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content: messageText.trim(),
    };

    sendMessage(payload, {
      onSuccess: (data) => {
        // Strip out metadata wrapper from back-end if necessary
        const savedMessage = {
          id: data.id,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.content,
          created_at: data.created_at,
        };

        // Manually update cache for instant feedback on sender side
        queryClient.setQueryData(
          ["messages", currentUser.id, selectedUser.id],
          (oldMessages: Message[]) => [...(oldMessages || []), savedMessage],
        );
        setMessageText("");
      },
    });
  };

  // Exclude current logged-in user from the chat list
  const chatList = users.filter((u) => u.id !== Number(currentUser.id));

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar */}
      <Sidebar
        selectedUser={selectedUser}
        onSelectUser={(user) => setSelectedUser(user)}
        chatList={chatList}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* Chat Window */}
      <ChatWindow
        currentUser={currentUser}
        messageText={messageText}
        onMessageTextChange={(e) => setMessageText(e.target.value)}
        messages={messages}
        onSendMessage={handleSend}
        selectedUser={selectedUser}
        socket={socket}
        typingUser={typingUser}
      />
    </div>
  );
}
