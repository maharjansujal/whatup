import { useMemo } from "react";
import { ConversationItem } from "./ConversationItem";
import { useChat } from "../../context/ChatContext";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { useAuth } from "../../context/AuthContext";

export function ConversationList() {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    conversationQuery,
    getConversationPreview,
  } = useChat();
  const { users } = useGetUsers();
  const { authUser: currentUser } = useAuth();

  const filtered = useMemo(() => {
    if (!currentUser) return [];

    const q = conversationQuery.trim().toLowerCase();
    if (!q) return conversations;

    return conversations.filter((c) => {
      if (c.type === "group") {
        return (c.name ?? "").toLowerCase().includes(q);
      }

      const otherId = c.member_ids.find((id) => id !== currentUser.id);
      if (!otherId) return false;

      const otherUser = users?.find((u) => u.id === otherId);
      if (!otherUser?.display_name) return false;

      return otherUser.display_name.toLowerCase().includes(q);
    });
  }, [conversations, conversationQuery, currentUser, users]);

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
          lastMessagePreview={getConversationPreview(conversation.id)}
        />
      ))}
    </div>
  );
}
