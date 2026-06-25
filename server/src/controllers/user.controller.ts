import { Request, Response } from "express";
import { getUserByIdService, getUsersService } from "../services/user.service";
import { uploadImage } from "../services/upload.service";

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
