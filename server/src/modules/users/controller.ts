import { createAppError } from "../../shared/errors/appError";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { getIO } from "../../socket";
import { SOCKET_EVENTS } from "../../socket/socket_events";
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

const updateStatus = asyncHandler(async (req, res) => {
  const status = await userService.setStatus({
    userId: req.user.id,
    status: req.body.status,
    statusTill: req.body.statusTill,
  });

  getIO().emit(SOCKET_EVENTS.STATUS_UPDATE, status);

  res.status(200).json(status);
});

const deleteStatus = asyncHandler(async (req, res) => {
  await userService.clearStatus(req.user.id);
  getIO().emit(SOCKET_EVENTS.STATUS_CLEAR, {
    userId: req.user.id,
  });
  res.status(204).send();
});

export const userController = {
  getAllUsers,
  getUserById,
  getMe,
  updateMe,
  searchUser,
  updateAvatar,
  updatePassword,
  updateStatus,
  deleteStatus,
};
