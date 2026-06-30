import { userRepository } from "./repository";

const getAllUsers = () => {
  const result = userRepository.getAllUsers();
  return result;
};

export const userService = {
  getAllUsers,
};
