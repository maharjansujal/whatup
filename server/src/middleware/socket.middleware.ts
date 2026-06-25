import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt";

export const registerSocketMiddleware = (io: Server) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication required"));
      }
      const user = verifyToken(token);
      socket.data.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });
};
