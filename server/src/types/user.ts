export interface User {
  id: number;
  username: string;
  name: string;
  password_hash: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}
