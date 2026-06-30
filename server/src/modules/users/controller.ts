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
  const user = await userService.getUserById(Number(req.params.id));
  res.status(200).json({ status: "success", data: user });
});

const getMe = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const you = await userService.getUserById(Number(userId));
  res.status(200).json({ status: "success", data: you });
});

export const userController = {
  getAllUsers,
  getUserById,
  getMe,
};
