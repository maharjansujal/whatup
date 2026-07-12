import z from "zod";

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
}

export interface UpdateUserDto {
  display_name?: string;
  username?: string;
  bio?: string | null;
  avatar_url?: string | null;
}

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),

  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(100, "New password is too long"),
});

export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;

export const UserStatusSchema = z.object({
  status: z.enum(["away", "dnd"]),
  statusTill: z.string().datetime().nullable(),
});
