import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import { type ConversationRequest } from "../../types/request";

export function useIncomingRequests() {
  return useQuery<ConversationRequest[]>({
    queryKey: ["requests", "incoming"],
    queryFn: async () => {
      const res = await api.get("/requests/incoming");
      return res.data;
    },
  });
}

export function useOutgoingRequests() {
  return useQuery<ConversationRequest[]>({
    queryKey: ["requests", "outgoing"],
    queryFn: async () => {
      const res = await api.get("/requests/outgoing");
      return res.data;
    },
  });
}
