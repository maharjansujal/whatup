import type { Message, User } from "../../hooks/useChatQueries";
import Avatar from "../ui/Avatar";

interface ChatBubbleProps {
  selectedUser: User;
  message: Message;
  currentUser: User;
}

export const ChatBubble = ({
  selectedUser,
  message,
  currentUser,
}: ChatBubbleProps) => {
  const isMe = message.sender_id === currentUser.id;
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className="flex items-center gap-2">
        {!isMe && <Avatar image={selectedUser.image} size={30} />}
        <div
          className="max-w-xs md:max-w-md p-3 rounded-xl shadow-md"
          style={{
            backgroundColor: isMe
              ? "var(--color-brand-primary)"
              : "var(--color-surface)",
            color: isMe ? "#ffffff" : "var(--color-text-primary)",
          }}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    </div>
  );
};
