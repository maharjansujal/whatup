import { Request, Response } from "express";
import {
  getUserByIdService,
  getUsersService,
  registerUserService,
} from "../services/user.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, name } = req.body;
    const result = await registerUserService(username, name);
    return res.status(201).json({ message: "New user created", ...result });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server error",
    });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const result = await getUsersService();
    return res
      .status(200)
      .json({ message: "Users retrieved successfully", result });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server error",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (Array.isArray(id) || isNaN(Number(id))) {
      return res.status(400).json({ message: "invalid user id received" });
    }
    const result = await getUserByIdService(Number(id));
    return res
      .status(200)
      .json({ message: "User retrieved successfully", ...result });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server error",
    });
  }
};
