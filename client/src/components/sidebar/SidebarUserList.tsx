import { Loader2, User } from "lucide-react";
import type { UserItem } from "../../hooks/get/useFetchUsers";

interface SidebarUserListProps {
  isLoading: boolean;
  error: Error | null;
  users?: UserItem[];
  selectedUser: UserItem | null;
  onSelectUser: (user: UserItem) => void;
}

export function SidebarUserList({
  isLoading,
  error,
  users,
  selectedUser,
  onSelectUser,
}: SidebarUserListProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
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
        users.map((item) => {
          const isSelected = selectedUser?.id === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectUser(item)}
              className={`flex items-center gap-3 p-4 border-b border-border-dark/30 cursor-pointer transition-all ${
                isSelected
                  ? "bg-brand/20 border-l-4 border-brand text-white"
                  : "hover:bg-border-dark/30 text-slate-300"
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-border-dark flex items-center justify-center border border-border-dark overflow-hidden shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={18} className="text-muted" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{item.name}</p>
                <p className="text-xs text-muted truncate">@{item.username}</p>
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
