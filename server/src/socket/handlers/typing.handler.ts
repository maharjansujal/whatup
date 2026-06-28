import { Socket, Server } from "socket.io";
import { getUserSocket } from "../users";
import { SocketEvents } from "../events";

export const registerTypingHandler = (socket: Socket, io: Server) => {
  const senderId = Number(socket.data.user.id);

  // USER STARTED TYPING
  socket.on(SocketEvents.TYPING, ({ receiverId }) => {
    const receiverSocketId = getUserSocket(Number(receiverId));

    if (!receiverSocketId) return;

    io.to(receiverSocketId).emit(SocketEvents.USER_TYPING, {
      senderId,
    });
  });

  // USER STOPPED TYPING
  socket.on(SocketEvents.STOP_TYPING, ({ receiverId }) => {
    const receiverSocketId = getUserSocket(Number(receiverId));

    if (!receiverSocketId) return;

    io.to(receiverSocketId).emit(SocketEvents.USER_STOPPED_TYPING, {
      senderId,
    });
  });
};
