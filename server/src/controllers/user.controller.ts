import { Request, Response } from "express";
import {
  getUserByIdService,
  getUsersService,
  updateLastSeenAtService,
  updateStatusService,
  updateUserService,
} from "../services/user.service";
import { uploadImage } from "../services/upload.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { Status } from "../types/user";

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

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    const result = await getUsersService(userId);
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
      return res.status(400).json({ message: "Invalid user id received" });
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

    const { username, name, password } = req.body;

    let image: string | undefined;

    if (req.file) {
      image = await uploadImage(req.file.buffer);
    }

    const result = await updateUserService({
      id: Number(req.user.id),
      updates: {
        username,
        name,
        password,
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
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

export const updateStatus = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user = req.user;
    const { custom_status } = req.body;
    if (!user?.id) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    const result = await updateStatusService(user.id, custom_status);
    return res.status(200).json({ message: "Status updated", ...result });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal server error",
    });
  }
};

export const updateLastSeenAt = async (id: number) => {
  await updateLastSeenAtService(id);
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log(req.user);
    if (!userId) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    const result = await getUserByIdService(Number(userId));

    return res.status(200).json({
      message: "User retrieved successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal server error",
    });
  }
};
