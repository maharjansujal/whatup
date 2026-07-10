import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/api";

type ReceiptStatus = "delivered" | "seen";

export interface UpdateReceiptInput {
  messageId: string;
  status: ReceiptStatus;
}

export function useUpdateReceipt() {
  return useMutation({
    mutationFn: async ({ messageId, status }: UpdateReceiptInput) => {
      const { data } = await api.patch(
        `/messages/${messageId}/receipts/${status}`,
      );

      return data;
    },
  });
}
