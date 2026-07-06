import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useGetConversations } from "../hooks/get/useGetConversations";
import { useGetMessages } from "../hooks/get/useGetMessages";
import { usePostMessage } from "../hooks/post/usePostMessage";
import { usePostGroupConversation } from "../hooks/post/usePostGroupConversation";
import { usePostDirectConversation } from "../hooks/post/usePostDirectConversation";
import type { Conversation } from "../types/conversation";
import type { Message } from "../types/message";
import { useAuth } from "./AuthContext";

interface ChatContextValue {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | undefined;
  messages: Message[];
  conversationQuery: string;
  setConversationQuery: (query: string) => void;
  selectConversation: (id: string) => void;
  sendMessage: (content: string) => void;
  createGroupConversation: (name: string, memberIds: string[]) => void;
  startDirectConversation: (userId: string) => void;
  getConversationPreview: (conversationId: string) => string;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  // Active conversation state
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [conversationQuery, setConversationQuery] = useState("");

  const { authUser } = useAuth();

  // Queries
  const { conversations = [] } = useGetConversations(authUser?.id);

  const { data: messages = [] } = useGetMessages(activeConversationId ?? "");

  // Mutations
  const postMessage = usePostMessage();
  const postGroupConversation = usePostGroupConversation();
  const postDirectConversation = usePostDirectConversation();

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId],
  );

  // Send message
  const sendMessage = (content: string) => {
    if (!activeConversationId || !content.trim()) return;
    postMessage.mutate({ conversationId: activeConversationId, content });
  };

  // Create group
  const createGroupConversation = (name: string, member_ids: string[]) => {
    postGroupConversation.mutate(
      { name, member_ids },
      {
        onSuccess: (newConversation) => {
          setActiveConversationId(newConversation.id);
        },
      },
    );
  };

  // Start direct
  const startDirectConversation = (userId: string) => {
    postDirectConversation.mutate(
      { userId },
      {
        onSuccess: (newConversation) => {
          console.log(newConversation);
          setActiveConversationId(newConversation.id);
        },
      },
    );
  };

  // Preview helper
  const getConversationPreview = (conversationId: string): string => {
    const list = conversationId
      ? conversationId === activeConversationId
        ? messages
        : []
      : [];
    if (!list || list.length === 0) return "No messages yet";
    const last = list[list.length - 1];
    if (last.type === "system") return last.content ?? "System message";
    if (last.type === "image") return "📷 Photo";
    if (last.type === "file")
      return `📎 ${last.attachments?.[0]?.filename ?? "File"}`;
    return last.content ?? "";
  };

  const value: ChatContextValue = {
    conversations,
    activeConversationId,
    activeConversation,
    messages,
    conversationQuery,
    setConversationQuery,
    selectConversation: setActiveConversationId,
    sendMessage,
    createGroupConversation,
    startDirectConversation,
    getConversationPreview,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
