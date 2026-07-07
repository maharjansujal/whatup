type Status = "pending" | "accepted" | "declined" | "cancelled";

export interface ConversationRequest {
  id: string;
  conversation_id?: string;
  requester_id: string;
  recipient_id: string;
  status: Status;
  created_at: string;
  responded_at?: string | null;
}
