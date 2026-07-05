import { authService } from "./service";
import { asyncHandler } from "../../shared/utils/asyncHandler";

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json(user);
});

const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only HTTPS in prod
    sameSite: "strict",
    maxAge: 1000 * 60 * 60,
  });

  res.status(200).json({ user }); // don’t expose token in body
});

export const authController = {
  register,
  login,
};
