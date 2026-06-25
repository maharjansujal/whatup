import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: number[]; // Can be used later if you broadcast online status
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

export const SocketProvider = ({
  children,
  authUserId,
}: {
  children: React.ReactNode;
  authUserId: number | null;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!authUserId) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect to the backend and pass the active userId in the query string
    const newSocket = io("http://localhost:5000", {
      query: { userId: authUserId },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [authUserId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers: [] }}>
      {children}
    </SocketContext.Provider>
  );
};
