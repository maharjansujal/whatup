export const USER_PUBLIC_COLUMNS = [
  "username",
  "display_name",
  "email",
  "avatar_url",
  "bio",
  "last_seen_at",
  "created_at",
  "updated_at",
  "deleted_at",
] as const;

export const USER_AUTH_COLUMNS = [
  "id",
  "username",
  "email",
  "password_hash",
].join(", ");
