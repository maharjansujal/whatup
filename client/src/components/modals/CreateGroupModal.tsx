import { useState } from "react";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { useAuth } from "../../context/AuthContext";
import { usePostGroupConversation } from "../../hooks/post/usePostGroupConversation";
import { Modal } from "../common/Modal";
import { UserSearchList } from "../common/UserList";
import { Users } from "lucide-react";
import { useModal } from "../../context/ModalContext";

export function CreateGroupModal({ onClose }: { onClose?: () => void }) {
  const [groupName, setGroupName] = useState("");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { users } = useGetUsers();
  const { authUser: currentUser } = useAuth();
  const { mutate: postGroup } = usePostGroupConversation();
  const { closeModal } = useModal();

  const handleClose = () => {
    if (onClose) onClose();
    else closeModal();
  };

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
      {
        name: groupName.trim(),
        member_ids: selectedIds,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <Modal title="Create a group" onClose={handleClose}>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#9A9CA8]">
        Group name
      </label>

      <input
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="e.g. Weekend Trip"
        className="mb-4 w-full rounded-lg border border-[#E5E5E1] bg-[#FAFAF8] px-3 py-2.5 text-sm"
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

      <button
        onClick={handleCreate}
        disabled={!canCreate}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#00C2A8] py-2.5 text-sm font-medium text-white disabled:opacity-40"
      >
        <Users size={16} />
        Create group ({selectedIds.length})
      </button>
    </Modal>
  );
}
