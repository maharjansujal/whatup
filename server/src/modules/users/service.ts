import { deleteAsset, uploadStream } from "../../shared/cloudinary/upload";
import { createAppError } from "../../shared/errors/appError";
import { hashPassword } from "../../shared/utils/hash";
import { userRepository } from "./repository";
import { UpdateUserDto } from "./types";
import bcrypt from "bcrypt";

const getAllUsers = () => {
  const result = userRepository.getAllUsers();
  return result;
};

const getUserById = (id: string) => {
  const result = userRepository.findById({ id });
  return result;
};

const update = ({ id, data }: { id: string; data: UpdateUserDto }) => {
  const result = userRepository.update({ id, data });
  return result;
};

const searchUser = ({
  username,
  email,
}: {
  username?: string;
  email?: string;
}) => {
  const result = userRepository.searchUser({ username, email });
  return result;
};

async function updateAvatar({
  userId,
  file,
}: {
  userId: string;
  file: Express.Multer.File;
}) {
  const user = await userRepository.findById({ id: userId });

  if (!user) {
    throw createAppError("User not found", 404);
  }

  const uploadedAvatar = await uploadStream({
    fileBuffer: file.buffer,
    folder: "whatup/avatars",
  });

  try {
    const updatedUser = await userRepository.updateAvatar({
      userId,
      avatar_url: uploadedAvatar.secure_url,
      avatar_public_id: uploadedAvatar.public_id,
    });

    if (user.avatar_public_id) {
      await deleteAsset(user.avatar_public_id, "image");
    }

    return updatedUser;
  } catch (error) {
    await deleteAsset(uploadedAvatar.public_id, "image");
    throw error;
  }
}

async function updatePassword({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  const user = await userRepository.findById({ id: userId });

  if (!user) {
    throw createAppError("User not found", 404);
  }

  const validPassword = await bcrypt.compare(
    currentPassword,
    user.password_hash,
  );

  if (!validPassword) {
    throw createAppError("Current password is incorrect", 400);
  }

  const hashedPassword = await hashPassword(newPassword);

  return userRepository.updatePassword({
    userId,
    password: hashedPassword,
  });
}

async function setStatus({
  userId,
  status,
  statusTill,
}: {
  userId: string;
  status: "away" | "dnd";
  statusTill: Date | null;
}) {
  return userRepository.upsertStatus({
    userId,
    status,
    statusTill,
  });
}

async function clearStatus(userId: string) {
  await userRepository.deleteStatus(userId);
}

async function cleanupExpiredStatuses() {
  return userRepository.deleteExpiredStatuses();
}

export const userService = {
  getAllUsers,
  getUserById,
  update,
  searchUser,
  updateAvatar,
  updatePassword,
  setStatus,
  clearStatus,
  cleanupExpiredStatuses,
};
