import { Crown, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
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
  const [query, setQuery] = useState("");

  const filtered = members?.filter((m) =>
    `${m.display_name} ${m.username}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <Modal title="Members" onClose={onClose}>
      <div>
        <div className="relative mb-3">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B2BE]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members"
            className="w-full rounded-lg bg-[#F2F2EF] py-2 pl-8 pr-3 text-[13px] text-[#1A1B23] placeholder:text-[#9A9CA8] focus:outline-none focus:ring-1 focus:ring-[#00C2A8]/60"
          />
        </div>

        {isLoading && (
          <div className="flex flex-col gap-3 py-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-[#F2F2EF]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 animate-pulse rounded bg-[#F2F2EF]" />
                  <div className="h-2.5 w-16 animate-pulse rounded bg-[#F2F2EF]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered?.length === 0 && (
          <p className="py-6 text-center text-[13px] text-[#9A9CA8]">
            No members match "{query}"
          </p>
        )}

        <ul className="flex max-h-80 h-auto flex-col gap-0.5 overflow-y-auto">
          {filtered?.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[#F9F9F7]"
            >
              <Avatar
                src={m.avatar_url}
                name={m.display_name}
                isOnline={false}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-['Space_Grotesk'] text-[13.5px] font-medium text-[#1A1B23]">
                  {m.display_name}
                </p>
                <p className="truncate font-['IBM_Plex_Mono'] text-[11px] text-[#9A9CA8]">
                  @{m.username}
                </p>
              </div>
              {m.role === "owner" && (
                <span className="flex items-center gap-1 rounded-full bg-[#00C2A8]/10 px-2 py-0.5 text-[10.5px] font-medium text-[#00A891]">
                  <Crown size={11} />
                  Owner
                </span>
              )}{" "}
              {m.role === "admin" && (
                <span className="flex items-center gap-1 rounded-full bg-[#00C2A8]/10 px-2 py-0.5 text-[10.5px] font-medium text-[#00A891]">
                  <ShieldCheck size={11} />
                  Owner
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
