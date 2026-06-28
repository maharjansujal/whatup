import { Server, Socket } from "socket.io";
import { registerConnection } from "./handlers/connection.handler";

export const initSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    registerConnection(socket, io);
  });
};
