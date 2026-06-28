import { Server } from "socket.io";
import { SocketEvents } from "../events";

export const emitMessagesDeliveredBulk = (io: Server, receiverId: number) => {
  io.emit(SocketEvents.BULK_DELIVERY, {
    receiverId,
  });
};
