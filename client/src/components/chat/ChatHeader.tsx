import { Info, Users } from "lucide-react";
import { Avatar } from "../common/Avatar";
import type { Conversation } from "../../types/conversation";
import { useAuth } from "../../context/AuthContext";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { GroupAvatarStack } from "../sidebar/GroupAvatarStack";

export function ChatHeader({ conversation }: { conversation: Conversation }) {
  const { authUser: currentUser } = useAuth();
  const { getUserById } = useGetUsers();

  if (!currentUser) return;
  const otherUserId =
    conversation.type === "direct"
      ? conversation.member_ids.find((id) => id !== currentUser.id)
      : undefined;
  const otherUser = otherUserId ? getUserById(otherUserId) : undefined;

  const title =
    conversation.type === "group"
      ? (conversation.name ?? "Unnamed group")
      : (otherUser?.display_name ?? "Unknown");
  //   const subtitle =
  //     conversation.type === "group"
  //       ? `${conversation.memberIds.length} members`
  //       : otherUser?.isOnline
  //         ? "Online"
  //         : "Offline";

  const subtitle =
    conversation.type === "group"
      ? `${conversation.member_ids.length} members`
      : "Online";

  return (
    <div className="flex items-center justify-between border-b border-[#EEEEEB] bg-white px-6 py-3.5">
      <div className="flex items-center gap-3">
        {conversation.type === "group" ? (
          <div className="pr-2">
            <GroupAvatarStack memberIds={conversation.member_ids} />
          </div>
        ) : (
          <Avatar src={otherUser?.avatar_url} name={title} isOnline={true} />
        )}
        <div className="leading-tight">
          <p className="font-['Space_Grotesk'] text-[14.5px] font-semibold text-[#1A1B23]">
            {title}
          </p>
          <p className="text-[12px] text-[#9A9CA8]">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {conversation.type === "group" && (
          <button
            title="Members"
            className="rounded-lg p-2 text-[#9A9CA8] transition-colors hover:bg-[#F2F2EF] hover:text-[#1A1B23]"
          >
            <Users size={17} />
          </button>
        )}
        <button
          title="Conversation info"
          className="rounded-lg p-2 text-[#9A9CA8] transition-colors hover:bg-[#F2F2EF] hover:text-[#1A1B23]"
        >
          <Info size={17} />
        </button>
      </div>
    </div>
  );
}
