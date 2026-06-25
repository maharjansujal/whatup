import { useState, useEffect, useRef } from "react";
import { SocketProvider, useSocket } from "./context/SocketContext";
import {
  useUsers,
  useConversation,
  useSendMessage,
  type Message,
} from "./hooks/useChatQueries";
import { useQueryClient } from "@tanstack/react-query";
import { ChatWindow } from "./components/chat/ChatWindow";
import { Sidebar } from "./components/layout/Sidebar";

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
  const [typingUser, setTypingUser] = useState<number | null>(null);

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

    socket.on("newMessage", (newMessage: Message) => {
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
      if (newMessage.sender_id === selectedUser?.id) {
        setTypingUser(null);
      }
    });

    // Listen for typing signals
    socket.on("userTyping", ({ senderId }) => {
      if (senderId === selectedUser?.id) {
        setTypingUser(senderId);
      }
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      if (senderId === selectedUser?.id) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
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
      <Sidebar
        selectedUser={selectedUser}
        onSelectUser={(user) => setSelectedUser(user)}
        chatList={chatList}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* Chat Window */}
      <ChatWindow
        currentUser={currentUser}
        messageText={messageText}
        onMessageTextChange={(e) => setMessageText(e.target.value)}
        messages={messages}
        onSendMessage={handleSend}
        selectedUser={selectedUser}
        socket={socket}
        typingUser={typingUser}
      />
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
