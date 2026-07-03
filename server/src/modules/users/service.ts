import { userRepository } from "./repository";
import { UpdateUserDto } from "./types";

const getAllUsers = () => {
  const result = userRepository.getAllUsers();
  return result;
};

const getUserById = (id: string) => {
  const result = userRepository.findById(id);
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

export const userService = {
  getAllUsers,
  getUserById,
  update,
  searchUser,
};
