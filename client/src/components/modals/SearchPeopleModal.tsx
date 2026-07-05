import { useEffect, useMemo, useState } from "react";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { Avatar } from "../common/Avatar";
import { Modal } from "../common/Modal";
import { Search } from "lucide-react";

export function SearchPeopleModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const { users } = useGetUsers();
  const { authUser: currentUser } = useAuth();
  const { startDirectConversation } = useChat();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users.filter((u) => u.id !== currentUser?.id);

    return users.filter(
      (u) =>
        u.id !== currentUser?.id &&
        (u.display_name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q)),
    );
  }, [users, query, currentUser?.id]);

  useEffect(() => {
    console.log(results);
  }, [results]);

  const handleSelect = (userId: string) => {
    startDirectConversation(userId);
    onClose();
  };

  return (
    <Modal title="Find people" onClose={onClose}>
      <div className="relative mb-4">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B7B9C4]"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or username"
          className="w-full rounded-lg border border-[#E5E5E1] bg-[#FAFAF8] py-2.5 pl-9 pr-3 text-sm text-[#1A1B23] placeholder:text-[#9A9CA8] focus:border-[#00C2A8] focus:outline-none focus:ring-1 focus:ring-[#00C2A8]"
        />
      </div>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-[#9A9CA8]">
          No one matches “{query}”.
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {results.map((user) => (
            <li key={user.id}>
              <button
                onClick={() => handleSelect(user.id)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#F2F2EF]"
              >
                <Avatar
                  src={user.avatar_url}
                  name={user.display_name}
                  isOnline={true}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#1A1B23]">
                    {user.display_name}
                  </p>
                  <p className="truncate text-xs text-[#9A9CA8]">
                    @{user.username}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
