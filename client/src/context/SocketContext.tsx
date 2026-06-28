import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { type UserItem } from "../hooks/get/useFetchUsers";
import { useQueryClient } from "@tanstack/react-query";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
}

interface SocketContextType {
  socket: Socket | null;
  activeUser: UserItem | null;
  setActiveUser: (user: UserItem | null) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isOnline: boolean;
  isTyping: boolean; // Added typing indicator state!
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);
const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [activeUser, setActiveUser] = useState<UserItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const newSocket = io(VITE_API_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    setSocket(newSocket);
    newSocket.on("connect", () => setIsOnline(true));
    newSocket.on("disconnect", () => setIsOnline(false));

    return () => {
      newSocket.close();
    };
  }, [token]);

  // Handle incoming real-time events from your server
  useEffect(() => {
    if (!socket) return;

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

    socket.on("newMessage", (message: Message) => {
      const chatId = activeUser?.id;

      queryClient.setQueryData(["messages", chatId], (old: Message[] = []) => {
        // Check if the message already exists in the cache to prevent duplicates
        const messageExists = old.some((msg) => msg.id === message.id);
        if (messageExists) return old;

        return [...old, message];
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    });

    socket.on("messageUpdated", (updatedMessage: Message) => {
      console.log("Received update:", updatedMessage);
      const chatId = activeUser?.id;

      queryClient.setQueryData(["messages", chatId], (old: Message[] = []) => {
        return old.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg,
        );
      });
    });

    socket.on("messageSeenUpdate", (updatedMessage: Message) => {
      const conversationId = updatedMessage.receiver_id;

      queryClient.setQueryData(
        ["messages", conversationId],
        (old: Message[] = []) => {
          return old.map((msg) =>
            msg.id === updatedMessage.id ? { ...msg, is_seen: true } : msg,
          );
        },
      );
    });
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
      socket.off("messageUpdated");
      socket.off("messageSeenUpdate");
    };
  }, [socket, activeUser]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        activeUser,
        setActiveUser,
        messages,
        setMessages,
        isOnline,
        isTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useChatSocket() {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useChatSocket must be used within a SocketProvider");
  return context;
}
