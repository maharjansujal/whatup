import { userRepository } from "./repository";

const getAllUsers = () => {
  const result = userRepository.getAllUsers();
  return result;
};

const getUserById = (id: number) => {
  const result = userRepository.getUserById(id);
  return result;
};

export const userService = {
  getAllUsers,
  getUserById,
};
