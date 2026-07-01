import { userRepository } from "./repository";
import { UpdateUserDto } from "./types";

const getAllUsers = () => {
  const result = userRepository.getAllUsers();
  return result;
};

const getUserById = (id: string) => {
  const result = userRepository.getUserById(id);
  return result;
};

const update = (id: string, data: UpdateUserDto) => {
  const result = userRepository.update(id, data);
  return result;
};

export const userService = {
  getAllUsers,
  getUserById,
  update,
};
