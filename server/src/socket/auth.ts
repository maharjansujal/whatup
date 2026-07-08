import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { AuthUser } from "../types/express";

export const socketAuth = (socket: Socket, next: Function) => {
  try {
    const token =
      socket.handshake.auth.token ??
      socket.handshake.headers.cookie
        ?.split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
      throw new Error();
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof payload === "string") {
      throw new Error();
    }

    socket.data.user = payload as AuthUser;

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};
