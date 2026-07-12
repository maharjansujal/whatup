import { Search, Settings } from "lucide-react";
import { Avatar } from "../common/Avatar";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { lazy } from "react";
import { usePresence } from "../../context/SocketContext";

const EditProfileModal = lazy(() =>
  import("../modals/EditProfileModal").then((module) => ({
    default: module.EditProfileModal,
  })),
);

export function SidebarHeader() {
  const { authUser: currentUser } = useAuth();
  const { conversationQuery, setConversationQuery } = useChat();
  const { openModal, closeModal } = useModal();
  if (!currentUser) return null;
  const presence = usePresence(currentUser);

  if (!currentUser) return null;

  return (
    <div className="border-b border-[#1F2130] px-4 pb-3 pt-4">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar
            src={currentUser?.avatar_url}
            name={currentUser?.display_name ?? ""}
            size="sm"
            presence={presence}
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-['Space_Grotesk'] text-[13.5px] font-semibold text-[#E7E8F0]">
              {currentUser?.display_name}
            </p>
          </div>
        </div>

        <button
          title="Edit profile"
          onClick={() => openModal(<EditProfileModal onClose={closeModal} />)}
          className="shrink-0 rounded-lg p-1.5 text-[#8A8DA3] transition-colors hover:bg-[#1D1F2E] hover:text-[#00C2A8]"
        >
          <Settings size={16} />
        </button>
      </div>

      <div className="relative mt-3.5">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8DA3]"
        />
        <input
          value={conversationQuery}
          onChange={(e) => setConversationQuery(e.target.value)}
          placeholder="Search conversations"
          className="w-full rounded-lg border border-[#2A2D3E] bg-[#1F2232] py-2 pl-9 pr-3 text-[13px] text-[#E7E8F0] placeholder:text-[#7B8098] transition-colors focus:border-[#00C2A8]/60 focus:outline-none focus:ring-1 focus:ring-[#00C2A8]/40"
        />
      </div>
    </div>
  );
}
