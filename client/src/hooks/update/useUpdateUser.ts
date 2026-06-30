import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";

const updateUser = async (formData: FormData) => {
  const { data } = await api.patch("/users/me", formData);
  return data.result;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["current-user"], updatedUser);

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
