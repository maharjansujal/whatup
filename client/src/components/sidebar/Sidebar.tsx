import { lazy, useState } from "react";
import {
  Archive,
  ArrowLeft,
  LogOut,
  MessageSquare,
  SquarePen,
  UsersRound,
} from "lucide-react";
import { SidebarHeader } from "./SidebarHeader";
import { ConversationList } from "./ConversationList";
import { useAuth } from "../../context/AuthContext";

const SearchPeopleModal = lazy(() =>
  import("../modals/SearchPeopleModal").then((module) => ({
    default: module.SearchPeopleModal,
  })),
);

const CreateGroupModal = lazy(() =>
  import("../modals/CreateGroupModal").then((module) => ({
    default: module.CreateGroupModal,
  })),
);

const FILTERS = ["all", "groups", "dms", "muted"] as const;
type Filter = (typeof FILTERS)[number];
const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  groups: "Groups",
  muted: "Muted",
  dms: "DMs",
};

export function Sidebar() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<"chats" | "archived">("chats");
  const { logout } = useAuth();

  return (
    <div className="flex h-full">
      {/* Thin nav rail */}
      <nav className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-[#1F2130] bg-[#0B0C13] py-4">
        <button
          title="Chats"
          onClick={() => setView("chats")}
          className={`rounded-lg p-2.5 transition-colors ${
            view === "chats"
              ? "bg-[#00C2A8]/15 text-[#00C2A8]"
              : "text-[#6D7089] hover:bg-[#1D1F2E] hover:text-gray-300"
          }`}
        >
          <MessageSquare size={19} />
        </button>

        <button
          title="New direct message"
          onClick={() => setSearchOpen(true)}
          className="rounded-lg p-2.5 text-[#6D7089] transition-colors hover:bg-[#1D1F2E] hover:text-gray-300"
        >
          <SquarePen size={19} />
        </button>

        <button
          title="New group"
          onClick={() => setCreateGroupOpen(true)}
          className="rounded-lg p-2.5 text-[#6D7089] transition-colors hover:bg-[#1D1F2E] hover:text-gray-300"
        >
          <UsersRound size={19} />
        </button>

        <button
          title="Archived chats"
          onClick={() => setView("archived")}
          className={`rounded-lg p-2.5 transition-colors ${
            view === "archived"
              ? "bg-[#00C2A8]/15 text-[#00C2A8]"
              : "text-[#6D7089] hover:bg-[#1D1F2E] hover:text-gray-300"
          }`}
        >
          <Archive size={19} />
        </button>

        <button
          title="Logout"
          onClick={() => logout()}
          className="mt-auto rounded-lg p-2.5 text-[#6D7089] transition-colors hover:bg-[#1D1F2E] hover:text-red-400"
        >
          <LogOut size={19} />
        </button>
      </nav>

      {/* Main sidebar panel */}
      <aside className="flex h-full w-75 flex-col bg-[#12131C]">
        {view === "chats" ? (
          <>
            <SidebarHeader />

            <div className="flex gap-2 border-b border-gray-700 px-3 py-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filter === f
                      ? "bg-[#00C2A8] text-black"
                      : "bg-[#1D1F2E] text-gray-300 hover:bg-[#181A26]"
                  }`}
                >
                  {FILTER_LABELS[f]}
                </button>
              ))}
            </div>

            <div className="sidebar-scroll flex-1 overflow-y-auto">
              <ConversationList filter={filter} />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 border-b border-[#1F2130] px-4 py-4">
              <button
                onClick={() => setView("chats")}
                className="rounded-lg p-1.5 text-[#8A8DA3] hover:bg-[#1D1F2E] hover:text-gray-200"
              >
                <ArrowLeft size={17} />
              </button>
              <p className="font-['Space_Grotesk'] text-[14px] font-semibold text-[#E7E8F0]">
                Archived chats
              </p>
            </div>

            <div className="sidebar-scroll flex-1 overflow-y-auto">
              <ConversationList filter="archived" />
            </div>
          </>
        )}
      </aside>

      {isSearchOpen && (
        <SearchPeopleModal onClose={() => setSearchOpen(false)} />
      )}
      {isCreateGroupOpen && (
        <CreateGroupModal onClose={() => setCreateGroupOpen(false)} />
      )}
    </div>
  );
}
