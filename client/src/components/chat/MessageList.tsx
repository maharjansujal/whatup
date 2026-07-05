import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

function dateLabel(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric" });
}

export function MessageList() {
  const { messages } = useChat();
  const { authUser: currentUser } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-[#9A9CA8]">No messages yet — say hello 👋</p>
      </div>
    );
  }

  let lastDate = "";

  return (
    <div className="flex-1 space-y-1 overflow-y-auto px-6 py-4">
      {messages.map((message, index) => {
        const currentDate = dateLabel(message.created_at);
        const showDateSeparator = currentDate !== lastDate;
        lastDate = currentDate;

        const prevMessage = messages[index - 1];
        const showAvatar =
          message.type !== "system" &&
          (!prevMessage ||
            prevMessage.sender_id !== message.sender_id ||
            prevMessage.type === "system");

        const isOwn = message.sender_id === currentUser?.id;
        const isLastOwnMessage =
          isOwn &&
          !messages
            .slice(index + 1)
            .some((m) => m.sender_id === currentUser.id);

        return (
          <div key={message.id}>
            {showDateSeparator && (
              <div className="my-4 flex items-center justify-center">
                <span className="rounded-full bg-[#F2F2EF] px-3 py-1 text-[11px] font-medium text-[#9A9CA8]">
                  {currentDate}
                </span>
              </div>
            )}
            <div className={showAvatar ? "mt-3" : "mt-0.5"}>
              <MessageBubble
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                isRead={isOwn && !isLastOwnMessage}
              />
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
