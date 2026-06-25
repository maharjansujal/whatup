import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import type { Message, User } from "../../hooks/useChatQueries";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface Props {
  selectedUser: User | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (e: React.SubmitEvent<Element>) => void;
  messageText: string;
  onMessageTextChange: (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => void;
  socket: Socket | null;
  typingUser: number | null;
}

export const ChatWindow = ({
  selectedUser,
  messages,
  currentUser,
  onSendMessage,
  messageText,
  onMessageTextChange,
  socket,
  typingUser,
}: Props) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const lastTypingEventTime = useRef<number>(0);
  const stopTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMessageTextChange(e);

    if (!socket || !selectedUser) return;

    const now = Date.now();
    const THROTTLE_TIME = 3000; // 3 seconds

    // THROTTLE: Send "typing" status if 3 seconds have passed since the last notification
    if (now - lastTypingEventTime.current > THROTTLE_TIME) {
      socket.emit("typing", {
        senderId: currentUser.id,
        receiverId: selectedUser.id,
      });
      lastTypingEventTime.current = now;
    }

    // STOP TYPING DETECTION: Clear the previous timeout and set a new one
    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }

    stopTypingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: currentUser.id,
        receiverId: selectedUser.id,
      });
      // Reset throttle baseline so next keystroke instantly fires again
      lastTypingEventTime.current = 0;
    }, 2000); // Declared "stopped" after 2 seconds of silence
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (stopTypingTimeoutRef.current)
        clearTimeout(stopTypingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      {selectedUser ? (
        <>
          {/* Chat Header */}
          <ChatHeader {...selectedUser} />

          {/* Messages Area */}
          <MessageList
            currentUser={currentUser}
            messageEndRef={messageEndRef}
            messages={messages}
            selectedUser={selectedUser}
            typingUser={typingUser}
          />

          {/* Input Form */}
          <MessageInput
            handleInputChange={handleInputChange}
            messageText={messageText}
            name={selectedUser.name}
            onSendMessage={onSendMessage}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-(--color-text-secondary)">
          Select a user from the sidebar to start a real-time conversation.
        </div>
      )}
    </div>
  );
};
