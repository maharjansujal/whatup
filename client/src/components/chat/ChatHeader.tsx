import { Info, Users } from "lucide-react";
import { Avatar } from "../common/Avatar";
import type { Conversation } from "../../types/conversation";
import { useAuth } from "../../context/AuthContext";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { GroupAvatarStack } from "../sidebar/GroupAvatarStack";
import { useModal } from "../../context/ModalContext";
import { MembersModal } from "../modals/MembersModal";
import { ConversationInfoModal } from "../modals/ConversationInfoModal";
import { useSocket } from "../../context/SocketContext";

interface ChatHeaderProps {
  conversation?: Conversation;
  draftRecipientId: string | null;
}

export function ChatHeader({
  conversation,
  draftRecipientId,
}: ChatHeaderProps) {
  const { authUser: currentUser } = useAuth();
  const { users } = useGetUsers();
  const draftRecipient = draftRecipientId
    ? users?.find((u) => u.id === draftRecipientId)
    : undefined;
  const { openModal, closeModal } = useModal();

  const { onlineUsers } = useSocket();

  if (currentUser === undefined) {
    return <div className="px-6 py-3 text-sm text-gray-400">Loading...</div>;
  }

  if (currentUser === null) return null;
  const otherUserId =
    conversation?.type === "direct"
      ? conversation.member_ids.find((id) => id !== currentUser.id)
      : draftRecipientId;

  const otherUser =
    conversation?.type === "direct"
      ? users?.find((u) => u.id === otherUserId)
      : draftRecipient;

  const isOnline = otherUserId ? onlineUsers.has(otherUserId) : false;

  const title = conversation
    ? conversation.type === "group"
      ? (conversation.name ?? "Unnamed group")
      : (otherUser?.display_name ?? "Unknown")
    : (draftRecipient?.display_name ?? "Unknown");

  const subtitle = conversation
    ? conversation.type === "group"
      ? `${conversation.member_ids.length} members`
      : isOnline
        ? "Online"
        : "Offline"
    : isOnline
      ? "Online"
      : "Offline";

  return (
    <div className="flex items-center justify-between border-b border-[#EEEEEB] bg-white px-6 py-3.5">
      <div className="flex items-center gap-3">
        {conversation?.type === "group" ? (
          <div className="pr-2">
            <GroupAvatarStack memberIds={conversation.member_ids} />
          </div>
        ) : (
          <Avatar
            src={otherUser?.avatar_url}
            name={title}
            isOnline={isOnline}
          />
        )}
        <div className="leading-tight">
          <p className="font-['Space_Grotesk'] text-[14.5px] font-semibold text-[#1A1B23]">
            {title}
          </p>
          <p className="text-[12px] text-[#9A9CA8]">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {conversation?.type === "group" && (
          <button
            title="Members"
            className="rounded-lg p-2 text-[#9A9CA8] transition-colors hover:bg-[#F2F2EF] hover:text-[#1A1B23]"
            onClick={() =>
              openModal(
                <MembersModal
                  conversationId={conversation.id}
                  onClose={closeModal}
                />,
              )
            }
          >
            <Users size={17} />
          </button>
        )}
        {conversation && (
          <button
            title="Conversation info"
            className="rounded-lg p-2 text-[#9A9CA8] transition-colors hover:bg-[#F2F2EF] hover:text-[#1A1B23]"
            onClick={() =>
              openModal(
                <ConversationInfoModal
                  conversationId={conversation.id}
                  onClose={closeModal}
                />,
              )
            }
          >
            <Info size={17} />
          </button>
        )}
      </div>
    </div>
  );
}
