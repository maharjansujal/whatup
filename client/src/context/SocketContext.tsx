import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Socket } from "socket.io-client";
import socket from "../socket/socket";
import { SOCKET_EVENTS } from "../socket/socket_events";

interface SocketContextType {
  socket: Socket;
  isConnected: boolean;
  onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [onlineUsers, setOnlineUsers] = useState(new Set<string>());

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    };

    const handleUserOnline = (userId: string) => {
      console.log("ONLINE EVENT RECEIVED", userId);
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.add(userId);
        return next;
      });
    };

    const handleUserOffline = (userId: string) => {
      console.log("OFFLINE EVENT RECEIVED", userId);
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    const handleConnectError = (err: Error) => {
      console.error("Socket connection error:", err.message);
    };

    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(new Set(users));
    };

    socket.on(SOCKET_EVENTS.CONNECTION, handleConnect);
    socket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socket.on(SOCKET_EVENTS.ERROR, handleConnectError);
    socket.on(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers);
    socket.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
    socket.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);

    return () => {
      socket.off(SOCKET_EVENTS.CONNECTION, handleConnect);
      socket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      socket.off(SOCKET_EVENTS.ERROR, handleConnectError);
      socket.off(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers);
      socket.off(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
      socket.off(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
    };
  }, [socket]);

  useEffect(() => {
    console.log(...onlineUsers);
  }, [onlineUsers]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
}
