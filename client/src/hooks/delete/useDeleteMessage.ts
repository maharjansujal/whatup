import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import toast from "react-hot-toast";

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
      toast.success("Deleted message successfully");
    },
  });
};
