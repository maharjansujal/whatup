export interface Block {
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface CreateBlockInput {
  blocker_id: string;
  blocked_id: string;
}

export interface BlockedUsers extends Block {
  blocked_user: string;
}
