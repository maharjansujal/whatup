import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: number) => {
      const { data } = await api.delete(`/messages/${messageId}`);

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
    },
  });
};
