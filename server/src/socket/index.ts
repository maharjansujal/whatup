import http from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { SOCKET_EVENTS } from "./socket_events";
import { messageService } from "../modules/messages/service";
import { AuthUser } from "../types/express";
import { conversationRepository } from "../modules/conversations/repository";

// Utility: verifyToken (reusable for sockets)
function verifyToken(token: string): AuthUser {
  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  if (typeof payload === "string") {
    throw new Error("Invalid token payload");
  }
  return payload as AuthUser;
}

export const onlineUsers = new Map<string, Set<string>>();
let io: Server;

export function initSocket(server: http.Server) {
  const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";

  io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.cookie?.split("token=")[1];
      if (!token) throw new Error("No token provided");

      const user = verifyToken(token);
      socket.data.user = user;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on(SOCKET_EVENTS.CONNECTION, async (socket: Socket) => {
    // console.log(`User connected: ${socket.data.user.id}`);
    const userId = socket.data.user.id;

    socket.join(`user:${userId}`); // Join a user room

    console.log("Joined user room:", `user:${userId}`, socket.rooms);

    // Track all sockets for this user
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
      socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, userId);
    }

    onlineUsers.get(userId)!.add(socket.id);
    socket.emit(SOCKET_EVENTS.ONLINE_USERS, [...onlineUsers.keys()]);

    const conversationIds =
      await conversationRepository.findConversationIdsByUser({ userId });
    for (const conversationId of conversationIds) {
      socket.join(conversationId);
    }

    // console.log(onlineUsers);
    console.log(
      "Connected users in socket",
      [...onlineUsers.entries()].map(([userId, sockets]) => ({
        userId,
        sockets: [...sockets],
      })),
    );

    // Send message
    socket.on(
      SOCKET_EVENTS.MESSAGE_SEND,
      async (payload: {
        conversationId: string;
        type: string;
        content: string;
        replyToMessageId?: string;
      }) => {
        console.log("MESSAGE_SEND", payload);
        try {
          const message = await messageService.createMessage({
            ...payload,
            senderId: socket.data.user.id, // enforce authenticated user
          });

          console.log("Broadcasting to room:", payload.conversationId);
          console.log("Message:", message);
          console.log([...io.sockets.adapter.rooms.entries()]);

          io.to(payload.conversationId).emit(
            SOCKET_EVENTS.MESSAGE_RECEIVE,
            message,
          );

          console.log("Broadcast complete");
        } catch (error) {
          console.error("Failed to send message:", error);
          socket.emit(SOCKET_EVENTS.ERROR, {
            message: "Failed to send message.",
          });
        }
      },
    );

    socket.on(SOCKET_EVENTS.TYPING_START, ({ conversationId }) => {
      console.log("Received typing:start", conversationId);
      socket.to(conversationId).emit(SOCKET_EVENTS.TYPING_START, {
        conversationId,
        userId: socket.data.user.id,
      });
    });

    socket.on(SOCKET_EVENTS.TYPING_STOP, ({ conversationId }) => {
      socket.to(conversationId).emit(SOCKET_EVENTS.TYPING_STOP, {
        conversationId,
        userId: socket.data.user.id,
      });
    });

    // Presence events

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      const userId = socket.data.user.id;

      // console.log(`User disconnected: ${userId}`);

      const sockets = onlineUsers.get(userId);

      if (!sockets) return;

      sockets.delete(socket.id);

      if (sockets.size === 0) {
        onlineUsers.delete(userId);
        // console.log("Broadcasting USER_OFFLINE", userId);
        socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, userId);
      }
    });
  });

  return io;
}

export function getIO() {
  return io;
}
