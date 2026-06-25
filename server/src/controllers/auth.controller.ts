import { Request, Response } from "express";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service";
import { uploadImage } from "../services/upload.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, name, password } = req.body;
    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    }
    const user = await registerUserService({
      username,
      name,
      password,
      image: imageUrl,
    });

    return res.status(201).json({
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await loginUserService(username, password);
    return res.status(200).json({ message: "Login successful", ...result });
  } catch (err) {
    res.status(401).json({
      message: err instanceof Error ? err.message : "Invalid credentials",
    });
  }
};
