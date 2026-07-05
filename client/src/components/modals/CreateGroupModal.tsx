import { useMemo, useState } from "react";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { useAuth } from "../../context/AuthContext";
// import { useChat } from "../../context/ChatContext";
import { Modal } from "../common/Modal";
import { Check, Search, Users } from "lucide-react";
import { Avatar } from "../common/Avatar";
import { usePostGroupConversation } from "../../hooks/post/usePostGroupConversation";

export function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const [groupName, setGroupName] = useState("");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { mutate: postGroup } = usePostGroupConversation();

  const { users } = useGetUsers();
  const { authUser: currentUser } = useAuth();
  // const { createGroupConversation } = useChat();

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

  const canCreate = groupName.trim().length > 0 && selectedIds.length >= 2;

  const toggleUser = (userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreate = () => {
    if (!canCreate) return;
    postGroup(
      { name: groupName.trim(), member_ids: selectedIds },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      title="Create a group"
      onClose={onClose}
      footer={
        <button
          onClick={handleCreate}
          disabled={!canCreate}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00C2A8] py-2.5 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Users size={16} />
          Create group{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
        </button>
      }
    >
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#9A9CA8]">
        Group name
      </label>
      <input
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="e.g. Weekend Trip"
        className="mb-4 w-full rounded-lg border border-[#E5E5E1] bg-[#FAFAF8] px-3 py-2.5 text-sm text-[#1A1B23] placeholder:text-[#9A9CA8] focus:border-[#00C2A8] focus:outline-none focus:ring-1 focus:ring-[#00C2A8]"
      />

      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#9A9CA8]">
        Add members
      </label>
      <div className="relative mb-3">
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

      {selectedIds.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {selectedIds.map((id) => {
            const user = users.find((u) => u.id === id);
            if (!user) return null;
            return (
              <span
                key={id}
                className="flex items-center gap-1 rounded-full bg-[#E8B54D]/15 px-2.5 py-1 text-xs font-medium text-[#8A6A1E]"
              >
                {user.display_name}
                <button
                  onClick={() => toggleUser(id)}
                  className="text-[#8A6A1E]/70 hover:text-[#8A6A1E]"
                >
                  x
                </button>
              </span>
            );
          })}
        </div>
      )}

      <ul className="flex flex-col gap-1">
        {results.map((user) => {
          const isSelected = selectedIds.includes(user.id);
          return (
            <li key={user.id}>
              <button
                onClick={() => toggleUser(user.id)}
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
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    isSelected
                      ? "border-[#00C2A8] bg-[#00C2A8]"
                      : "border-[#D8D8D3]"
                  }`}
                >
                  {isSelected && <Check size={13} className="text-white" />}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
