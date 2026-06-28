export type Status = "sent" | "delivered" | "seen";

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  updated_at: string | null;
  status: Status;
}
