import { Socket, Server } from "socket.io";
import { markMessageSeen } from "../../controllers/message.controller";
import { getUserSocket } from "../users";
import { SocketEvents } from "../events";
import { emitMessageSeenUpdate } from "../emitters/message.emitter";

export const registerMessageSeenHandler = (socket: Socket, io: Server) => {
  socket.on(SocketEvents.MESSAGE_SEEN, async ({ messageId }) => {
    try {
      // Update DB
      const updatedMessage = await markMessageSeen(Number(messageId));

      // If message doesn't exist or already seen
      if (!updatedMessage) return;

      // Emit update to sender
      emitMessageSeenUpdate(io, updatedMessage.sender_id, updatedMessage);
    } catch (err) {
      console.error("messageSeen handler failed:", err);
    }
  });
};
