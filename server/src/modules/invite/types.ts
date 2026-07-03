export interface Invite {
  id: string;
  conversation_id: string;
  code: string;
  created_by_user_id: string;
  expires_at?: string;
  max_uses?: string;
  used_count: number;
  is_active: boolean;
  created_at: string;
}
