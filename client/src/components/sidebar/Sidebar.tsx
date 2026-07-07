import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { ConversationList } from "./ConversationList";
import { SearchPeopleModal } from "../modals/SearchPeopleModal";
import { CreateGroupModal } from "../modals/CreateGroupModal";
import { Button } from "../shared/button";
import { useAuth } from "../../context/AuthContext";

const FILTERS = ["All", "Archived", "Muted"] as const;
type Filter = (typeof FILTERS)[number];

export function Sidebar() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("All");
  const { logout } = useAuth();

  return (
    <aside className="flex h-full w-75 flex-col bg-[#12131C]">
      <SidebarHeader
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCreateGroup={() => setCreateGroupOpen(true)}
      />

      <div className="flex gap-2 px-3 py-2 border-b border-gray-700">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === f
                ? "bg-[#00C2A8] text-black"
                : "bg-[#1D1F2E] text-gray-300 hover:bg-[#181A26]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* THIS is the scroll area */}
      <div className="flex-1 overflow-y-auto">
        <ConversationList filter={filter} />
      </div>

      {/* footer pinned */}
      <div className="border-t p-4 shrink-0">
        <Button
          variant="outline"
          onClick={logout}
          className="w-full text-gray-200 border-gray-700 hover:bg-gray-800"
        >
          Logout
        </Button>
      </div>

      {isSearchOpen && (
        <SearchPeopleModal onClose={() => setSearchOpen(false)} />
      )}
      {isCreateGroupOpen && (
        <CreateGroupModal onClose={() => setCreateGroupOpen(false)} />
      )}
    </aside>
  );
}
