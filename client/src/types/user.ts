export interface User {
  id: string;
  username: string;
  display_name: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  avatar_public_id?: string;
  bio?: string;
  last_seen_at?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  custom_status?: "dnd" | "away";
  status_till?: string;
}

export interface UpdateUserDto {
  display_name?: string;
  username?: string;
  bio?: string | null;
  avatar_url?: string | null;
}

export interface RegisterDto {
  username: string;
  display_name: string;
  email: string;
  password: string;
  avatar?: File;
}

export interface LoginDto {
  username?: string;
  email?: string;
  password: string;
}

export interface UserStatus {
  status: "away" | "dnd";
  statusTill: Date | null;
}
