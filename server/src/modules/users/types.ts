export interface User {
  id: number;
  username: string;
  display_name: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  bio?: string;
  last_seen_at?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}
