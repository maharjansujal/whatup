import { Socket } from "socket.io";
import { removeUser } from "../users";

export const registerDisconnectHandler = (socket: Socket, userId: number) => {
  socket.on("disconnect", () => {
    try {
      // 1. Remove user from active socket map
      removeUser(userId);

      // 2. Optional logging
      console.log(`User disconnected: ${userId} (socket: ${socket.id})`);
    } catch (err) {
      console.error("disconnect handler failed:", err);
    }
  });
};
