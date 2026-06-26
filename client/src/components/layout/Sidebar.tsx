import { useState } from "react";
import { useFetchUsers, type UserItem } from "../../hooks/get/useFetchUsers";
import { Search, Loader2, User } from "lucide-react";

interface SidebarProps {
  onSelectUser: (user: UserItem) => void;
  selectedUser: UserItem | null;
}

export function Sidebar({ onSelectUser, selectedUser }: SidebarProps) {
  const { data: users, isLoading, error } = useFetchUsers();
  const [search, setSearch] = useState("");

  // Filter users locally based on search input text
  const filteredUsers = users?.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <aside className="w-80 md:w-80 h-full bg-sidebar border-r border-border-dark flex flex-col text-slate-200">
      <div className="p-4 border-b border-border-dark flex items-center justify-center">
        <img
          src="https://lh3.googleusercontent.com/a-/ALV-UjUkcJVB86BFYmFar54_RAYBipQE_MXi1TswFZSz23GmNiLzfl4=s300-p-k-rw-no"
          alt="Company Logo"
          className="h-50 w-auto object-contain rounded-full"
        />
      </div>
      <div className="p-4 border-b border-border-dark">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-muted" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-border-dark/40 border border-border-dark rounded-xl text-sm text-white placeholder:text-muted/60 focus:outline-none focus:border-brand/60 transition-all"
          />
        </div>
      </div>

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
        ) : filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((item) => {
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
                  <p className="text-xs text-muted truncate">
                    @{item.username}
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
    </aside>
  );
}
