import { useEffect, useRef } from "react";
import type { Message, User } from "../hooks/useChatQueries";
import type { Socket } from "socket.io-client";

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

    // 1. THROTTLE: Send "typing" status if 3 seconds have passed since the last notification
    if (now - lastTypingEventTime.current > THROTTLE_TIME) {
      socket.emit("typing", {
        senderId: currentUser.id,
        receiverId: selectedUser.id,
      });
      lastTypingEventTime.current = now;
    }

    // 2. STOP TYPING DETECTION: Clear the previous timeout and set a new one
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
          <div className="p-4 border-b border-slate-800 bg-slate-950">
            <h3 className="font-semibold text-slate-200">
              {selectedUser.name}
            </h3>
            <p className="text-xs text-slate-400">Active Session</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => {
              const isMe = msg.sender_id === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${
                      isMe
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              );
            })}

            {typingUser === selectedUser?.id && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-slate-800 text-slate-200 p-3 rounded-xl rounded-bl-none shadow-md flex items-center justify-center min-w-12.5 h-9.5">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={onSendMessage}
            className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2"
          >
            <input
              type="text"
              value={messageText}
              onChange={handleInputChange}
              placeholder={`Message ${selectedUser.name}...`}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Send
            </button>
          </form>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          Select a user from the sidebar to start a real-time conversation.
        </div>
      )}
    </div>
  );
};
