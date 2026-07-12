import { authService } from "./service";
import { asyncHandler } from "../../shared/utils/asyncHandler";

const register = asyncHandler(async (req, res) => {
  const user = await await authService.register({
    ...req.body,
    avatar: req.file,
  });
  console.log(req.file);
  res.status(201).json(user);
});

const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only HTTPS in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60,
  });

  res.status(200).json({ user }); // don’t expose token in body
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export const authController = {
  register,
  login,
  logout,
};
