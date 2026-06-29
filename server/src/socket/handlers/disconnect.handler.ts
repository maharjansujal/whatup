import { Server, Socket } from "socket.io";
import { getOnlineUsersList, removeUser } from "../users";
import { SocketEvents } from "../events";

export const registerDisconnectHandler = (
  socket: Socket,
  io: Server,
  userId: number,
) => {
  socket.on("disconnect", () => {
    try {
      // 1. Remove user from active socket map
      removeUser(userId);

      io.emit(SocketEvents.GET_ONLINE_USERS, getOnlineUsersList());
      // 2. Optional logging
      console.log(`User disconnected: ${userId} (socket: ${socket.id})`);
    } catch (err) {
      console.error("disconnect handler failed:", err);
    }
  });
};
