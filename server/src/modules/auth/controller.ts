import { authService } from "./service";
import { asyncHandler } from "../../shared/utils/asyncHandler";

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json(user);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
});

export const authController = {
  register,
  login,
};
