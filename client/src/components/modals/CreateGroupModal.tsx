import { useState } from "react";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { useAuth } from "../../context/AuthContext";
// import { useChat } from "../../context/ChatContext";
import { Modal } from "../common/Modal";
import { usePostGroupConversation } from "../../hooks/post/usePostGroupConversation";
import { UserSearchList } from "../common/UserList";
import { Users } from "lucide-react";

export function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const [groupName, setGroupName] = useState("");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { mutate: postGroup } = usePostGroupConversation();

  const { users } = useGetUsers();
  const { authUser: currentUser } = useAuth();
  // const { createGroupConversation } = useChat();

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
      <UserSearchList
        users={users}
        currentUserId={currentUser?.id}
        query={query}
        setQuery={setQuery}
        onSelect={toggleUser}
        selectedIds={selectedIds}
      />
    </Modal>
  );
}
