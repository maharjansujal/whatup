import { Request, Response } from "express";
import {
  getUserByIdService,
  getUsersService,
  updateUserService,
} from "../services/user.service";
import { uploadImage } from "../services/upload.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const imageUrl = await uploadImage(req.file.buffer);

    res.json({
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
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

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const { username, name, password_hash, image } = req.body;

    const result = await updateUserService({
      id: Number(req.user.id),
      updates: {
        username,
        name,
        password_hash,
        image,
      },
    });
    if (!result) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User updated successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server error",
    });
  }
};
