import { createContext, useEffect, useState } from "react";
import socket from "../socket/socket";
import {
  registerSocketListeners,
  cleanupSocketListeners,
} from "../socket/listeners";
import type { Socket } from "socket.io-client";
import type { Message } from "../types/message";

interface SocketContextType {
  socket: Socket;
  messages: Message[];
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    registerSocketListeners((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      cleanupSocketListeners();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
