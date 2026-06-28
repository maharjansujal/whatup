import { Server, Socket } from "socket.io";
import { registerUser } from "../users";
import { markMessageDelivered } from "../../controllers/message.controller";

import { registerTypingHandler } from "./typing.handler";
import { registerMessageSeenHandler } from "./messageSeen.handler";
import { registerDisconnectHandler } from "./disconnect.handler";
import { emitMessageDeliveredBulk } from "../emitters/message.emitter";

const handleUserRegistration = (socket: Socket, userId: number) => {
  registerUser(userId, socket.id);
  console.log(`User connected: ${userId} -> ${socket.id}`);
};

const handleDeliveryCatchup = async (io: Server, userId: number) => {
  try {
    const updatedMessages = await markMessageDelivered(userId);

    if (updatedMessages.length > 0) {
      emitMessageDeliveredBulk(io, userId);
    }
  } catch (err) {
    console.error("Delivery catch-up failed", err);
  }
};

const registerFeatureHandlers = (
  socket: Socket,
  io: Server,
  userId: number,
) => {
  registerTypingHandler(socket, io);
  registerMessageSeenHandler(socket, io);
  registerDisconnectHandler(socket, userId);
};

export const registerConnection = async (socket: Socket, io: Server) => {
  const user = socket.data.user;

  if (!user?.id) {
    console.error("Socket connected without valid user");
    return socket.disconnect();
  }

  const userId = Number(user.id);

  handleUserRegistration(socket, userId);

  await handleDeliveryCatchup(io, userId);

  registerFeatureHandlers(socket, io, userId);
};
