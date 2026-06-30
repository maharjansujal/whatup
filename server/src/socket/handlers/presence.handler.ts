import { Socket } from "socket.io";
import { updateLastSeenAt } from "../../controllers/user.controller";
import { SocketEvents } from "../events";

export const registerPresenceHandler = (socket: Socket) => {
  socket.on(SocketEvents.HEARTBEAT, async () => {
    try {
      const userId = socket.data.user.id;

      await updateLastSeenAt(userId);
    } catch (err) {
      console.error("Heartbeat failed:", err);
    }
  });
};
