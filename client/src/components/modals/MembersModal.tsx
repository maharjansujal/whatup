import { Modal } from "../common/Modal";
import { Avatar } from "../common/Avatar";
import { useGetConversationMembers } from "../../hooks/get/useGetConversationMembers";

export function MembersModal({
  conversationId,
  onClose,
}: {
  conversationId: string;
  onClose: () => void;
}) {
  const { data: members, isLoading } =
    useGetConversationMembers(conversationId);

  return (
    <Modal title="Members" onClose={onClose}>
      {isLoading && <p className="text-sm text-gray-400">Loading...</p>}
      <ul className="flex flex-col gap-2">
        {members?.map((m) => (
          <li key={m.id} className="flex items-center gap-3">
            <Avatar src={m.avatar_url} name={m.display_name} isOnline={false} />
            <div>
              <p className="text-sm font-medium">{m.display_name}</p>
              <p className="text-xs text-gray-500">@{m.username}</p>
              <p className="text-xs text-gray-400">{m.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
