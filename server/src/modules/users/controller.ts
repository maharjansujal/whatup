import { createAppError } from "../../shared/errors/appError";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { userService } from "./service";

const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: "success",
    data: users,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id.toString());
  res.status(200).json({ status: "success", data: user });
});

const getMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const you = await userService.getUserById(userId.toString());
  res.status(200).json({ status: "success", data: you });
});

const updateMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.update({ id: userId, data: req.body });
  res.status(200).json({
    status: "success",
    data: result,
  });
});

const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw createAppError("Avatar image is required", 400);
  }

  const user = await userService.updateAvatar({
    userId: req.user.id,
    file: req.file,
  });

  res.status(200).json(user);
});

const updatePassword = asyncHandler(async (req, res) => {
  const user = await userService.updatePassword({
    userId: req.user.id,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  });

  res.status(200).json(user);
});

const searchUser = asyncHandler(async (req, res) => {
  const { username, email } = req.query;
  const result = await userService.searchUser({
    username: username as string | undefined,
    email: email as string | undefined,
  });
  return res.status(200).json(result);
});

export const userController = {
  getAllUsers,
  getUserById,
  getMe,
  updateMe,
  searchUser,
  updateAvatar,
  updatePassword,
};
