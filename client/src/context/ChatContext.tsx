import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useGetConversations } from "../hooks/get/useGetConversations";
import { useGetMessages } from "../hooks/get/useGetMessages";
import { usePostGroupConversation } from "../hooks/post/usePostGroupConversation";
import { usePostDirectConversation } from "../hooks/post/usePostDirectConversation";
import type { Conversation } from "../types/conversation";
import type { Message } from "../types/message";
import { useAuth } from "./AuthContext";
import { SOCKET_EVENTS } from "../socket/socket_events";
import { useSocket } from "./SocketContext";

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

  const { data: fetchedMessages } = useGetMessages(activeConversationId ?? "");

  const { socket } = useSocket();

  useEffect(() => {
    const handleMessage = (message: Message) => {
      if (message.conversation_id !== activeConversationId) {
        return;
      }

      setMessages((prev) => [...prev, message]);
    };

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVE, handleMessage);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVE, handleMessage);
    };
  }, [socket, activeConversationId]);

  const [messages, setMessages] = useState<Message[]>([]);
  // Mutations
  const postGroupConversation = usePostGroupConversation();
  const postDirectConversation = usePostDirectConversation();

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId],
  );

  useEffect(() => {
    if (!activeConversationId) return;

    socket.emit(SOCKET_EVENTS.CONVERSATION_JOIN, activeConversationId);

    return () => {
      socket.emit(SOCKET_EVENTS.CONVERSATION_LEAVE, activeConversationId);
    };
  }, [activeConversationId]);

  useEffect(() => {
    if (!fetchedMessages) return;

    setMessages(fetchedMessages);
  }, [fetchedMessages]);

  // Send message
  const sendMessage = (content: string) => {
    if (!activeConversationId || !content.trim()) return;
    // postMessage.mutate({ conversationId: activeConversationId, content });
    socket.emit(SOCKET_EVENTS.MESSAGE_SEND, {
      conversationId: activeConversationId,
      type: "text",
      content,
    });
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
