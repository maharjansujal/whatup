import { Check, Search } from "lucide-react";
import type { User } from "../../types/user";
import { useMemo } from "react";
import { Avatar } from "./Avatar";

interface UserSearchListProps {
  users: User[];
  currentUserId?: string;
  query: string;
  setQuery: (q: string) => void;
  onSelect: (userId: string) => void;
  selectedIds?: string[];
}

export function UserSearchList({
  users,
  currentUserId,
  query,
  setQuery,
  onSelect,
  selectedIds = [],
}: UserSearchListProps) {
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users.filter((u) => u.id !== currentUserId);

    return users.filter(
      (u) =>
        u.id !== currentUserId &&
        (u.display_name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q)),
    );
  }, [users, query, currentUserId]);

  return (
    <div className="flex h-full flex-col">
      <div className="relative mb-3 shrink-0">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B7B9C4]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people"
          className="w-full rounded-lg border border-[#E5E5E1] bg-[#FAFAF8] py-2.5 pl-9 pr-3 text-sm text-[#1A1B23] placeholder:text-[#9A9CA8] focus:border-[#00C2A8] focus:outline-none focus:ring-1 focus:ring-[#00C2A8]"
        />
      </div>

      <ul className="flex-1 h-full overflow-y-auto flex flex-col gap-1">
        {results.map((user) => {
          const isSelected = selectedIds.includes(user.id);

          return (
            <li key={user.id}>
              <button
                onClick={() => onSelect(user.id)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#F2F2EF]"
              >
                <Avatar
                  src={user.avatar_url}
                  name={user.display_name}
                  isOnline={true}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#1A1B23]">
                    {user.display_name}
                  </p>
                  <p className="truncate text-xs text-[#9A9CA8]">
                    @{user.username}
                  </p>
                </div>

                {selectedIds.length > 0 && (
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      isSelected
                        ? "border-[#00C2A8] bg-[#00C2A8]"
                        : "border-[#D8D8D3]"
                    }`}
                  >
                    {isSelected && <Check size={13} className="text-white" />}
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
