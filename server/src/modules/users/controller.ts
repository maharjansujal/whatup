import { asyncHandler } from "../../shared/utils/asyncHandler";
import { userService } from "./service";

const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: "success",
    data: users,
  });
});
export const userController = {
  getAllUsers,
};
