import { Server } from "socket.io";
import { SocketEvents } from "../events";
import { getUserSocket } from "../users";
import { Message } from "../../types/message";

export const emitMessageSeenUpdate = (
  io: Server,
  senderId: number,
  message: Message,
) => {
  const socketId = getUserSocket(senderId);
  if (!socketId) return;

  io.to(socketId).emit(SocketEvents.MESSAGE_SEEN_UPDATE, message);
};

export const emitMessageDeliveredBulk = (io: Server, receiverId: number) => {
  io.emit(SocketEvents.BULK_DELIVERY, {
    receiverId,
  });
};
