import { createContext, useContext, useState } from "react";
import type { Conversation } from "../types/conversation";

interface ConversationContextValue {
  conversations: Conversation[];
  selectedConversationId: string | null;
  setSelectedConversation: (id: string | null) => void;
  setConversations: (convos: Conversation[]) => void;
}

const ConversationContext = createContext<ConversationContextValue | undefined>(
  undefined,
);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversation] = useState<
    string | null
  >(null);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        selectedConversationId,
        setSelectedConversation,
        setConversations,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversationContext() {
  const ctx = useContext(ConversationContext);
  if (!ctx)
    throw new Error(
      "useConversationContext must be used within ConversationProvider",
    );
  return ctx;
}
