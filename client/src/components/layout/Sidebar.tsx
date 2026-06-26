import { useState } from "react";
import { useFetchUsers, type UserItem } from "../../hooks/get/useFetchUsers";
import { Search } from "lucide-react";
import { SidebarHeader } from "../sidebar/SidebarHeader";
import { SidebarUserList } from "../sidebar/SidebarUserList";

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
    <aside className="h-full bg-sidebar border-r border-border-dark flex flex-col text-slate-200">
      <SidebarHeader />
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
      <SidebarUserList
        isLoading={isLoading}
        error={error}
        users={filteredUsers}
        selectedUser={selectedUser}
        onSelectUser={onSelectUser}
      />
    </aside>
  );
}
