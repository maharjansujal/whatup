import { useState, useEffect, useRef } from "react";
import { SocketProvider, useSocket } from "./context/SocketContext";
import {
  useUsers,
  useConversation,
  useSendMessage,
} from "./hooks/useChatQueries";
import { useQueryClient } from "@tanstack/react-query";

function ChatApp({
  currentUser,
  onLogout,
}: {
  currentUser: { id: number; username: string; name: string };
  onLogout: () => void;
}) {
  const { data: users = [] } = useUsers();
  const [selectedUser, setSelectedUser] = useState<typeof currentUser | null>(
    null,
  );
  const [messageText, setMessageText] = useState("");

  const { data: messages = [] } = useConversation(
    currentUser.id,
    selectedUser?.id || null,
  );
  const sendMessageMutation = useSendMessage();
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages come in
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming Socket.io messages in real-time
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (
        (newMessage.sender_id === selectedUser?.id &&
          newMessage.receiver_id === currentUser.id) ||
        (newMessage.sender_id === currentUser.id &&
          newMessage.receiver_id === selectedUser?.id)
      ) {
        queryClient.setQueryData(
          ["messages", currentUser.id, selectedUser?.id],
          (oldMessages: any) => [...(oldMessages || []), newMessage],
        );
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedUser, currentUser.id, queryClient]);

  const handleSend = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    const payload = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content: messageText.trim(),
    };

    // Optimistically update UI or let mutation handle it
    sendMessageMutation.mutate(payload, {
      onSuccess: (data) => {
        // Strip out metadata wrapper from back-end if necessary
        const savedMessage = {
          id: data.id,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.content,
          created_at: data.created_at,
        };

        // Manually update cache for instant feedback on sender side
        queryClient.setQueryData(
          ["messages", currentUser.id, selectedUser.id],
          (oldMessages: any) => [...(oldMessages || []), savedMessage],
        );
        setMessageText("");
      },
    });
  };

  // Exclude current logged-in user from the chat list
  const chatList = users.filter((u) => u.id !== currentUser.id);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-950">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg">{currentUser.name}</h2>
            <p className="text-xs text-slate-400">@{currentUser.username}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
          >
            Exit
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <h3 className="text-xs font-semibold text-slate-500 uppercase px-2 my-2">
            Active Users
          </h3>
          {chatList.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedUser?.id === user.id
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-slate-400">@{user.username}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
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
              onSubmit={handleSend}
              className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2"
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
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
    </div>
  );
}

// Global Shell Component executing the local session selector
export default function App() {
  const { data: users = [], isLoading } = useUsers();
  const [activeUser, setActiveUser] = useState<any | null>(null);

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading Data...
      </div>
    );
  }

  // Pseudo-login layout if no user session is picked in this tab
  if (!activeUser) {
    return (
      <div className="h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 max-w-sm w-full shadow-xl">
          <h2 className="text-xl font-bold mb-1 text-center text-indigo-400">
            Select Test Profile
          </h2>
          <p className="text-xs text-slate-400 text-center mb-6">
            Choose who you are browsing as in this window.
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setActiveUser(user)}
                className="w-full text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors block"
              >
                <div className="font-semibold text-sm">{user.name}</div>
                <div className="text-xs text-slate-500">@{user.username}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <SocketProvider authUserId={activeUser.id}>
      <ChatApp currentUser={activeUser} onLogout={() => setActiveUser(null)} />
    </SocketProvider>
  );
}
