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
import { useQueryClient } from "@tanstack/react-query";
import { usePostMessage } from "../hooks/post/usePostMessage";
import { useUpdateReceipt } from "../hooks/update/useUpdateReceipt";
import { canShowNotification, showNotification } from "../utils/notifications";

interface ChatContextValue {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  activeConversation: Conversation | undefined;
  messages: Message[];
  conversationQuery: string;
  setConversationQuery: (query: string) => void;
  selectConversation: (id: string) => void;
  sendMessage: ({
    content,
    files,
  }: {
    content: string;
    files?: File[];
  }) => void;
  isSendingMessage: boolean;
  createGroupConversation: (name: string, memberIds: string[]) => void;
  startDirectConversation: (userId: string) => void;
  getConversationPreview: (conversationId: string) => string;
  draftRecipientId: string | null;
  typingUsers: Record<string, Set<string>>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  // Active conversation state
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [draftRecipientId, setDraftRecipientId] = useState<string | null>(null);
  const [conversationQuery, setConversationQuery] = useState("");
  const [typingUsers, setTypingUsers] = useState<Record<string, Set<string>>>(
    {},
  );
  const { authUser } = useAuth();

  // Queries
  const { conversations = [] } = useGetConversations(authUser?.id);

  const { data: fetchedMessages } = useGetMessages(activeConversationId ?? "");

  const { socket } = useSocket();
  const updateReceipt = useUpdateReceipt();

  const handleMessageDelivered = (payload: {
    messageId: string;
    userId: string;
    deliveredAt: string;
  }) => {
    setMessages((prev) => {
      const msg = prev.find((m) => m.id === payload.messageId);

      console.log("Message before update:", msg);
      console.log("receipts", msg?.receipts);

      return prev.map((message) => {
        if (message.id !== payload.messageId) {
          return message;
        }

        const currentReceipts = message.receipts || [];
        const hasReceipt = currentReceipts.some(
          (r) => String(r.user_id) === String(payload.userId),
        );

        return {
          ...message,
          receipts: hasReceipt
            ? currentReceipts.map((receipt) =>
                String(receipt.user_id) === String(payload.userId)
                  ? {
                      ...receipt,
                      delivered_at: payload.deliveredAt,
                    }
                  : receipt,
              )
            : [
                ...currentReceipts,
                {
                  message_id: payload.messageId,
                  user_id: payload.userId,
                  delivered_at: payload.deliveredAt,
                },
              ],
        };
      });
    });
  };

  const handleMessageSeen = (payload: {
    messageId: string;
    userId: string;
    seenAt: string;
  }) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id !== payload.messageId) {
          return message;
        }

        const currentReceipts = message.receipts || [];
        const hasReceipt = currentReceipts.some(
          (r) => String(r.user_id) === String(payload.userId),
        );

        return {
          ...message,
          receipts: hasReceipt
            ? currentReceipts.map((receipt) =>
                String(receipt.user_id) === String(payload.userId)
                  ? {
                      ...receipt,
                      seen_at: payload.seenAt,
                    }
                  : receipt,
              )
            : [
                ...currentReceipts,
                {
                  message_id: payload.messageId,
                  user_id: payload.userId,
                  seen_at: payload.seenAt,
                },
              ],
        };
      }),
    );
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Fetched messages", fetchedMessages);
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  useEffect(() => {
    const handleMessage = (message: Message) => {
      // setMessages((prev) => [...prev, message]);

      queryClient.setQueryData(
        ["conversations", authUser?.id],
        (old: Conversation[]) => {
          if (!old) return old;

          const updated = old.map((c) =>
            c.id === message.conversation_id
              ? { ...c, last_message: message }
              : c,
          );

          updated.sort((a, b) => {
            const aTime = a.last_message
              ? new Date(a.last_message.created_at).getTime()
              : 0;

            const bTime = b.last_message
              ? new Date(b.last_message.created_at).getTime()
              : 0;

            return bTime - aTime;
          });
          console.log(updated);
          return updated;
        },
      );

      queryClient.setQueryData(
        ["messages", message.conversation_id],
        (old: Message[] | undefined) => {
          if (!old) return old;
          if (old.some((m) => m.id === message.id)) return old;
          return [...old, message];
        },
      );

      if (message.sender_id !== authUser?.id) {
        updateReceipt.mutate({
          messageId: message.id,
          status: "delivered",
        });
      }

      if (message.sender_id !== authUser?.id && canShowNotification()) {
        showNotification({
          title: `${message.sender.display_name} sent you a message`,
          body:
            message.content ??
            `${message.sender.display_name} sent you an attachment`,
        });
      }

      if (message.conversation_id === activeConversationId) {
        console.log({
          sender: message.sender_id,
          me: authUser?.id,
          shouldDeliver: message.sender_id !== authUser?.id,
        });

        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    };

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVE, handleMessage);
    socket.on(SOCKET_EVENTS.CONVERSATION_CREATED, handleConversationCreated);
    socket.on(SOCKET_EVENTS.TYPING_START, handleTypingStart);
    socket.on(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);
    socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, handleMessageDelivered);
    socket.on(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVE, handleMessage);
      socket.off(SOCKET_EVENTS.CONVERSATION_CREATED, handleConversationCreated);
      socket.off(SOCKET_EVENTS.TYPING_START, handleTypingStart);
      socket.off(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);
      socket.off(SOCKET_EVENTS.MESSAGE_DELIVERED, handleMessageDelivered);
      socket.off(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
    };
  }, [socket, activeConversationId, authUser?.id, queryClient]);

  const postMessage = usePostMessage();

  const [messages, setMessages] = useState<Message[]>([]);
  // Mutations
  const postGroupConversation = usePostGroupConversation();
  const postDirectConversation = usePostDirectConversation();

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId],
  );

  // Send message
  const sendMessage = ({
    content,
    files = [],
  }: {
    content: string;
    files?: File[];
  }) => {
    const send = (conversationId: string) => {
      postMessage.mutate({
        conversationId,
        type: "text",
        content,
        files,
      });
    };
    if (draftRecipientId) {
      postDirectConversation.mutate(
        { userId: draftRecipientId },
        {
          onSuccess: (conversation) => {
            setDraftRecipientId(null);
            setActiveConversationId(conversation.id);

            send(conversation.id);
          },
        },
      );
      return;
    }
    if (!activeConversationId) return;
    send(activeConversationId);
  };
  // Create group
  const createGroupConversation = (name: string, member_ids: string[]) => {
    postGroupConversation.mutate(
      { name, member_ids },
      {
        onSuccess: (newConversation) => {
          setMessages([]);
          queryClient.setQueryData(
            ["conversations", authUser?.id],
            (old: Conversation[] = []) => {
              if (old.some((c) => c.id === newConversation.id)) return old;

              return [newConversation, ...old];
            },
          );
          setActiveConversationId(newConversation.id);
        },
      },
    );
  };

  // Start direct
  const startDirectConversation = (userId: string) => {
    setDraftRecipientId(userId);
    setActiveConversationId(null);
    setMessages([]);
  };

  const handleConversationCreated = (conversation: Conversation) => {
    queryClient.setQueryData(
      ["conversations", authUser?.id],
      (old: Conversation[] = []) => {
        const updated = old.filter((c) => c.id !== conversation.id);

        updated.unshift(conversation);

        return updated;
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

  const handleTypingStart = ({
    conversationId,
    userId,
  }: {
    conversationId: string;
    userId: string;
  }) => {
    setTypingUsers((prev) => {
      const users = new Set(prev[conversationId] ?? []);
      users.add(userId);

      return {
        ...prev,
        [conversationId]: users,
      };
    });
  };

  const handleTypingStop = ({
    conversationId,
    userId,
  }: {
    conversationId: string;
    userId: string;
  }) => {
    setTypingUsers((prev) => {
      const users = new Set(prev[conversationId] ?? []);
      users.delete(userId);

      return {
        ...prev,
        [conversationId]: users,
      };
    });
  };
  const value: ChatContextValue = {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    messages,
    conversationQuery,
    setConversationQuery,
    selectConversation: (id: string) => {
      setDraftRecipientId(null);
      setActiveConversationId(id);
    },
    sendMessage,
    isSendingMessage: postMessage.isPending,
    createGroupConversation,
    startDirectConversation,
    getConversationPreview,
    draftRecipientId,
    typingUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
