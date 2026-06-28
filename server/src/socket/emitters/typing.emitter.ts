import { Server } from "socket.io";
import { SocketEvents } from "../events";
import { getUserSocket } from "../users";

export const emitUserTyping = (
  io: Server,
  receiverId: number,
  senderId: number,
) => {
  const socketId = getUserSocket(receiverId);
  if (!socketId) return;

  io.to(socketId).emit(SocketEvents.USER_TYPING, {
    senderId,
  });
};

export const emitUserStoppedTyping = (
  io: Server,
  receiverId: number,
  senderId: number,
) => {
  const socketId = getUserSocket(receiverId);
  if (!socketId) return;

  io.to(socketId).emit(SocketEvents.USER_STOPPED_TYPING, {
    senderId,
  });
};
