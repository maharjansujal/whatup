import { useAuth } from "../../context/AuthContext";
import { usePresence } from "../../context/SocketContext";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import type { Conversation, LastMessage } from "../../types/conversation";
import { Avatar } from "../common/Avatar";
import { GroupAvatarStack } from "./GroupAvatarStack";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  lastMessage: LastMessage | null;
}

function formatTimestamp(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  lastMessage,
}: ConversationItemProps) {
  const { users } = useGetUsers();
  const { authUser: currentUser } = useAuth();
  const otherUserId =
    conversation.type === "direct"
      ? conversation.member_ids.find((id) => id !== currentUser?.id)
      : undefined;
  const otherUser = otherUserId
    ? users?.find((u) => u.id === otherUserId)
    : undefined;

  let preview = lastMessage?.content;

  if (lastMessage?.deleted_at) {
    preview =
      lastMessage.sender_id === currentUser?.id
        ? "You deleted a message"
        : "This message was deleted";
  }

  const title =
    conversation.type === "group"
      ? (conversation.name ?? "Unnamed group")
      : (otherUser?.display_name ?? "Unknown");

  // const { onlineUsers } = useSocket();
  // const isOnline = onlineUsers.has(otherUserId ?? "");
  const presence = usePresence(otherUser);

  return (
    <button
      onClick={onSelect}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
        isActive ? "bg-[#1D1F2E]" : "hover:bg-[#181A26]"
      }`}
    >
      {conversation.type === "group" ? (
        <GroupAvatarStack memberIds={conversation.member_ids} />
      ) : (
        <Avatar src={otherUser?.avatar_url} name={title} presence={presence} />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-['Space_Grotesk'] text-[13.5px] font-medium text-[#E7E8F0]">
            {title}
          </span>
          <span className="shrink-0 font-['IBM_Plex_Mono'] text-[10.5px] text-[#6D7089]">
            {formatTimestamp(lastMessage?.created_at)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[12.5px] text-[#8A8DA3]">
          {preview ?? "No messages yet"}
        </p>
      </div>
    </button>
  );
}
