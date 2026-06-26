// src/context/SocketContext.tsx (Updated to match your server)
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { type UserItem } from "../hooks/get/useFetchUsers";

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
  sendMessage: (content: string) => void;
  isOnline: boolean;
  isTyping: boolean; // Added typing indicator state!
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);
const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function SocketProvider({ children }: { children: React.ReactNode }) {
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

    // MATCHES SERVER: Listening for "newMessage"
    const handleIncomingMessage = (message: Message) => {
      if (
        activeUser &&
        (message.sender_id === activeUser.id ||
          message.receiver_id === activeUser.id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // MATCHES SERVER: Listeners for typing indicators
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

    socket.on("newMessage", handleIncomingMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [socket, activeUser]);

  // Emitting payloads to your server
  const sendMessage = (content: string) => {
    if (!socket || !activeUser) return;

    // MATCHES SERVER: Emitting "newMessage" with camelCase receiverId
    socket.emit("newMessage", {
      receiverId: activeUser.id,
      content,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        activeUser,
        setActiveUser,
        messages,
        setMessages,
        sendMessage,
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
