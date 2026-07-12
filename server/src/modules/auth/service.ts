import { LoginDto, RegisterDto } from "./validator";
import { hashPassword } from "../../shared/utils/hash";
import { createAppError } from "../../shared/errors/appError";
import { authRepository } from "./repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../users/repository";
import { deleteAsset, uploadStream } from "../../shared/cloudinary/upload";

async function register(data: RegisterDto) {
  const emailExists = await userRepository.findByEmail(data.email);
  const usernameExists = await userRepository.findByUsername(data.username);

  if (emailExists) {
    throw createAppError("Email already exists", 400);
  }

  if (usernameExists) {
    throw createAppError("Username already exists", 400);
  }

  let uploadedAvatar: Awaited<ReturnType<typeof uploadStream>> | null = null;

  try {
    if (data.avatar) {
      uploadedAvatar = await uploadStream({
        fileBuffer: data.avatar.buffer,
        folder: "whatup/avatars",
      });
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await authRepository.create({
      ...data,
      password: hashedPassword,
      avatar_url: uploadedAvatar?.secure_url ?? null,
      avatar_public_id: uploadedAvatar?.public_id ?? null,
    });

    return user;
  } catch (error) {
    if (uploadedAvatar) {
      await deleteAsset(uploadedAvatar.public_id, "image");
    }

    throw error;
  }
}

async function login(data: LoginDto) {
  const user = data.email
    ? await userRepository.findByEmail(data.email)
    : await userRepository.findByUsername(data.username!);

  if (!user) throw createAppError("Invalid credentials", 401);

  const valid = await bcrypt.compare(data.password, user.password_hash);
  if (!valid) throw createAppError("Invalid credentials", 401);

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );

  return { token, user };
}

export const authService = {
  register,
  login,
};
