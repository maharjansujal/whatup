import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { UserMessage } from "../types/user";

interface SocketContextType {
  socket: Socket | null;
  activeUser: UserMessage | null;
  setActiveUser: (user: UserMessage | null) => void;
  isOnline: boolean;
  isTyping: boolean;
  onlineUsers: number[];
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [activeUser, setActiveUser] = useState<UserMessage | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
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
    newSocket.on("disconnect", () => {
      setIsOnline(false);
      setOnlineUsers([]);
    });

    newSocket.on("getOnlineUsers", (users: number[]) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.close();
    };
  }, [token]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        activeUser,
        setActiveUser,
        isOnline,
        isTyping,
        onlineUsers,
        setIsTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useChatSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useChatSocket must be used within a SocketProvider");
  }
  return context;
}
