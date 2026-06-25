import type { Message, User } from "../../hooks/useChatQueries";
import Avatar from "../ui/Avatar";
import { ChatBubble } from "./ChatBubble";

interface Props {
  messages: Message[];
  currentUser: User;
  selectedUser: User;
  typingUser: Number | null;
  messageEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList = ({
  messages,
  currentUser,
  selectedUser,
  typingUser,
  messageEndRef,
}: Props) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        return (
          <ChatBubble
            key={msg.id}
            currentUser={currentUser}
            message={msg}
            selectedUser={selectedUser}
          />
        );
      })}

      {typingUser === selectedUser?.id && (
        <div className="flex justify-start items-center animate-fade-in gap-2">
          <Avatar image={selectedUser.image} size={25} />

          <div className="flex items-center justify-center min-w-12.5 h-9.5 bg-(--color-surface) text-(--color-text-primary)">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-text-secondary) animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-text-secondary) animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-text-secondary) animate-bounce" />
            </div>
          </div>
        </div>
      )}
      <div ref={messageEndRef} />
    </div>
  );
};
