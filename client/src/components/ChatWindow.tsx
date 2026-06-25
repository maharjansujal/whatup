import { useRef } from "react";
import type { Message, User } from "../hooks/useChatQueries";

interface Props {
  selectedUser: User | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (e: React.SubmitEvent<Element>) => void;
  messageText: string;
  onMessageTextChange: (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => void;
}

export const ChatWindow = ({
  selectedUser,
  messages,
  currentUser,
  onSendMessage,
  messageText,
  onMessageTextChange,
}: Props) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

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
              onChange={onMessageTextChange}
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
