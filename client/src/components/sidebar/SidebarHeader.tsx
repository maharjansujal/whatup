import { Search, SquarePen, UsersRound } from "lucide-react";
import { Avatar } from "../common/Avatar";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

interface SidebarHeaderProps {
  onOpenSearch: () => void;
  onOpenCreateGroup: () => void;
}

export function SidebarHeader({
  onOpenSearch,
  onOpenCreateGroup,
}: SidebarHeaderProps) {
  const { authUser: currentUser } = useAuth();
  const { conversationQuery, setConversationQuery } = useChat();

  return (
    <div className="border-b border-[#1F2130] px-4 pb-3 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar
            src={currentUser?.avatar_url}
            name={currentUser?.display_name ?? ""}
            size="sm"
            isOnline
          />
          <div className="leading-tight">
            <p className="font-['Space_Grotesk'] text-[13.5px] font-semibold text-[#E7E8F0]">
              {currentUser?.display_name}
            </p>
            <p className="font-['IBM_Plex_Mono'] text-[10.5px] text-[#5FE0CB]">
              online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSearch}
            title="New direct message"
            className="rounded-lg p-2 text-[#8A8DA3] transition-colors hover:bg-[#1D1F2E] hover:text-[#00C2A8]"
          >
            <SquarePen size={17} />
          </button>
          <button
            onClick={onOpenCreateGroup}
            title="New group"
            className="rounded-lg p-2 text-[#8A8DA3] transition-colors hover:bg-[#1D1F2E] hover:text-[#00C2A8]"
          >
            <UsersRound size={17} />
          </button>
        </div>
      </div>

      <div className="relative mt-3.5">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5B5F73]"
        />
        <input
          value={conversationQuery}
          onChange={(e) => setConversationQuery(e.target.value)}
          placeholder="Search conversations"
          className="w-full rounded-lg bg-[#181A26] py-2 pl-9 pr-3 text-[13px] text-[#E7E8F0] placeholder:text-[#5B5F73] focus:outline-none focus:ring-1 focus:ring-[#00C2A8]/60"
        />
      </div>
    </div>
  );
}
