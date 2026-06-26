import React, { useState, useEffect, useRef } from "react";
import { useChatSocket } from "../../context/SocketContext";
import { Send, User } from "lucide-react";

export function ChatWindow() {
  const { activeUser, messages, sendMessage, socket, isTyping } =
    useChatSocket();
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  // Auto-scroll anchor timeline tracking
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle typing triggers mapping to your server's socket.ts file
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    if (!socket || !activeUser) return;

    // Emit backend event string "typing"
    socket.emit("typing", { receiverId: activeUser.id });

    // Simple debounce to clear typing notification state
    const timeoutId = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: activeUser.id });
    }, 1500);

    return () => clearTimeout(timeoutId);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendMessage(text.trim());

    // Explicitly notify server typing has ended on click send
    socket?.emit("stopTyping", { receiverId: activeUser?.id });
    setText("");
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* 1. Window Header Banner */}
      <div className="h-16 w-full bg-white border-b border-border-light px-6 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-chat border border-border-light flex items-center justify-center overflow-hidden">
            {activeUser?.image ? (
              <img
                src={activeUser.image}
                alt={activeUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} className="text-muted" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-sidebar">
              {activeUser?.name}
            </h4>
            <p className="text-xs text-muted">@{activeUser?.username}</p>
          </div>
        </div>
      </div>

      {/* 2. Messages Bubble History Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUser?.id;
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-2xs ${
                  isMe
                    ? "bg-brand text-white rounded-br-none"
                    : "bg-white text-sidebar border border-border-light rounded-bl-none"
                }`}
              >
                <p className="leading-relaxed break-words">{msg.content}</p>
                <span
                  className={`text-[10px] block mt-1 text-right ${isMe ? "text-white/70" : "text-muted"}`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Real-time Dynamic Typing indicator notice box */}
        {isTyping && (
          <div className="flex w-full justify-start animate-pulse">
            <div className="bg-white text-muted border border-border-light rounded-2xl rounded-bl-none px-4 py-2 text-xs italic">
              {activeUser?.name} is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Message Input Action Panel */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t border-border-light flex items-center gap-3 shrink-0"
      >
        <input
          type="text"
          placeholder={`Message @${activeUser?.username}...`}
          value={text}
          onChange={handleInputChange}
          className="flex-1 bg-chat border border-border-light rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/40 transition-all text-sidebar placeholder:text-muted/50"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center hover:bg-brand-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
