import { useMemo } from "react";
import { ConversationItem } from "./ConversationItem";
import { useChat } from "../../context/ChatContext";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { useAuth } from "../../context/AuthContext";

type ListFilter = "all" | "groups" | "muted" | "archived" | "dms";

export function ConversationList({ filter }: { filter: ListFilter }) {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    conversationQuery,
  } = useChat();
  const { users } = useGetUsers();
  const { authUser: currentUser } = useAuth();

  const filtered = useMemo(() => {
    if (!currentUser) return [];

    let base: typeof conversations;
    switch (filter) {
      case "archived":
        base = conversations.filter((c) => c.is_archived);
        break;
      case "groups":
        base = conversations.filter(
          (c) => !c.is_archived && c.type === "group",
        );
        break;
      case "muted":
        base = conversations.filter(
          (c) =>
            !c.is_archived &&
            c.muted_until &&
            new Date(c.muted_until) > new Date(),
        );
        break;
      case "dms":
        base = conversations.filter(
          (c) => !c.is_archived && c.type === "direct",
        );
        break;
      default:
        base = conversations.filter((c) => !c.is_archived);
    }

    const q = conversationQuery.trim().toLowerCase();
    if (!q) return base;

    return base.filter((c) => {
      if (c.type === "group") {
        return (c.name ?? "").toLowerCase().includes(q);
      }

      const otherId = c.member_ids.find((id) => id !== currentUser.id);
      if (!otherId) return false;

      const otherUser = users?.find((u) => u.id === otherId);
      if (!otherUser?.display_name) return false;

      return otherUser.display_name.toLowerCase().includes(q);
    });
  }, [conversations, conversationQuery, currentUser, users, filter]);

  if (filtered.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-sm text-[#6D7089]">
        No conversations match your search.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1 px-2 py-2">
      {filtered.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeConversationId}
          onSelect={() => selectConversation(conversation.id)}
          lastMessage={conversation.last_message}
        />
      ))}
    </div>
  );
}
