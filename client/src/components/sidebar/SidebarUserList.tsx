import { Loader2 } from "lucide-react";
import type { UserMessage } from "../../types/user";
import { useChatSocket } from "../../context/SocketContext";
import { Avatar, getPresence, PresenceDot } from "../shared/Avatar";

interface SidebarUserListProps {
  isLoading: boolean;
  error: Error | null;
  users?: UserMessage[];
  selectedUser: UserMessage | null;
  onSelectUser: (user: UserMessage) => void;
}

export function SidebarUserList({
  isLoading,
  error,
  users,
  selectedUser,
  onSelectUser,
}: SidebarUserListProps) {
  const { onlineUsers } = useChatSocket();

  return (
    <div className="flex-1 overflow-y-auto px-2">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted">
          <Loader2 className="animate-spin text-brand" size={24} />
          <span className="text-xs">Loading directory...</span>
        </div>
      ) : error ? (
        <div className="p-4 text-xs text-error font-medium text-center">
          Failed to populate contacts list.
        </div>
      ) : users && users.length > 0 ? (
        users.map((user) => {
          const isSelected = selectedUser?.id === user.id;
          const isUserOnline = onlineUsers.includes(user.id);

          const presence = getPresence(isUserOnline, user.custom_status);

          return (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`flex items-center gap-3 p-2 cursor-pointer rounded-lg ${
                isSelected ? "bg-brand/40" : "hover:bg-border-dark/30"
              }`}
            >
              <div className="relative">
                <Avatar image={user.image} name={user.name} />
                <PresenceDot presence={presence} />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate">{user.name}</h4>
                <p className="text-xs truncate mt-0.5">
                  {user.last_message ?? ""}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-6 text-center text-xs text-muted">
          No active contacts found.
        </div>
      )}
    </div>
  );
}
