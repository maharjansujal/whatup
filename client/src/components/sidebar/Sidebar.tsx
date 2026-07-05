import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { ConversationList } from "./ConversationList";
import { SearchPeopleModal } from "../modals/SearchPeopleModal";
import { CreateGroupModal } from "../modals/CreateGroupModal";

export function Sidebar() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isCreateGroupOpen, setCreateGroupOpen] = useState(false);

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col bg-[#12131C]">
      <SidebarHeader
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCreateGroup={() => setCreateGroupOpen(true)}
      />
      <div className="flex-1 overflow-y-auto">
        <ConversationList />
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
