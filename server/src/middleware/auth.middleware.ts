import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/express";

export const requireAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof payload === "string") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = payload as AuthUser;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
