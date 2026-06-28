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
      queryClient.setQueryData(["me"], updatedUser);

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...JSON.parse(storedUser),
            ...updatedUser,
          }),
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
