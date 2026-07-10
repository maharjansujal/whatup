import { useEffect, useMemo, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { TypingBubble } from "./TypingBubble";
import type { User } from "../../types/user";
import { useGetUsers } from "../../hooks/get/useGetUsers";

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
  const { getUserById } = useGetUsers();

  const latestSeenUsers = useMemo(() => {
    const latestMessageByUser = new Map<string, string>();

    for (const message of messages) {
      for (const receipt of message.receipts ?? []) {
        if (receipt.seen_at) {
          latestMessageByUser.set(receipt.user_id, message.id);
        }
      }
    }
    const result = new Map<string, User[]>();

    latestMessageByUser.forEach((messageId, userId) => {
      const user = getUserById(userId.toString());

      if (!user) return;

      const users = result.get(messageId) ?? [];
      users.push(user);
      result.set(messageId, users);
    });

    return result;
  }, [messages, getUserById]);

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
                latestSeenUsers={latestSeenUsers}
              />
            </div>
          </div>
        );
      })}
      <TypingBubble />
      <div ref={bottomRef} />
    </div>
  );
}
