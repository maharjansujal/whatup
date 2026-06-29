import { Loader2, User } from "lucide-react";
import type { UserMessage } from "../../types/user";
import { useChatSocket } from "../../context/SocketContext";

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
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;
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
          const isUnseen =
            user.last_message_status !== "seen" &&
            user.last_message_sender_id !== currentUser.id;

          const isSelected = selectedUser?.id === user.id;
          const isUserOnline = onlineUsers.includes(user.id);

          return (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`flex items-center gap-3 p-2 border-b border-border-dark/30 cursor-pointer transition-all rounded-lg ${
                isSelected
                  ? "bg-brand/40 text-white"
                  : "hover:bg-border-dark/30 text-slate-300"
              }`}
            >
              {/* Avatar + Online Status */}
              <div className="relative w-11 h-11 shrink-0">
                <div className="w-full h-full rounded-full bg-border-dark flex items-center justify-center border border-border-dark overflow-hidden">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-muted" />
                  )}
                </div>

                {/* Online indicator */}
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                    isUserOnline ? "bg-green-500" : "bg-orange-500"
                  }`}
                />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-semibold truncate ${
                    isSelected ? "text-white" : "text-slate-100"
                  }`}
                >
                  {user.name}
                </h4>

                <p
                  className={`text-xs truncate mt-0.5 ${
                    isUnseen ? "text-white font-semibold" : "text-muted/70"
                  }`}
                >
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
