import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { ConversationList } from "./ConversationList";
import { SearchPeopleModal } from "../modals/SearchPeopleModal";
import { CreateGroupModal } from "../modals/CreateGroupModal";
import { Button } from "../shared/button";
import { useAuth } from "../../context/AuthContext";

export function Sidebar() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <aside className="flex h-full w-75 flex-col bg-[#12131C]">
      <SidebarHeader
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCreateGroup={() => setCreateGroupOpen(true)}
      />

      {/* THIS is the scroll area */}
      <div className="flex-1 overflow-y-auto">
        <ConversationList />
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
