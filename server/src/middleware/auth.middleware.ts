import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/express";

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies?.token; // read cookie

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof payload === "string") {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = payload as AuthUser;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
