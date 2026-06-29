import { useState, useEffect, useRef } from "react";
import { useChatSocket } from "../../context/SocketContext";
import { useUpdateMessage } from "../../hooks/update/useUpdateMessage";
import { useDeleteMessage } from "../../hooks/delete/useDeleteMessage";
import { ChatBubble } from "./ChatBubble";
import { Send, User } from "lucide-react";
import { useGetMessages } from "../../hooks/get/useGetMessages";
import { usePostMessage } from "../../hooks/post/usePostMessage";
import { useMessageListeners } from "../../hooks/socket/useMessageListeners";
import { useTypingListeners } from "../../hooks/socket/useTypingListeners";

export function ChatWindow() {
  const { activeUser, socket, isTyping } = useChatSocket();

  const { mutateAsync: sendMessageApi } = usePostMessage();

  useMessageListeners();
  useTypingListeners();

  const { data: messages } = useGetMessages(activeUser?.id);

  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeUser) {
      inputRef.current?.focus();
    }
  }, [activeUser]);

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  const { mutateAsync: updateMessage } = useUpdateMessage();
  const { mutateAsync: deleteMessage } = useDeleteMessage();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [activeUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    if (!socket || !activeUser) return;

    socket.emit("typing", { receiverId: activeUser.id });

    const timeoutId = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: activeUser.id });
    }, 1500);

    return () => clearTimeout(timeoutId);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeUser) return;
    try {
      await sendMessageApi({
        receiverId: activeUser.id,
        content: text.trim(),
      });
      socket?.emit("stopTyping", {
        receiverId: activeUser.id,
      });
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (messageId: number) => {
    if (!editedText.trim()) return;

    try {
      await updateMessage({
        messageId,
        content: editedText,
        receiverId: activeUser?.id,
      });

      setEditingId(null);
      setEditedText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (messageId: number) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await deleteMessage(messageId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
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

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages &&
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id;
            return (
              <ChatBubble
                key={msg.id}
                editedText={editedText}
                setEditedText={setEditedText}
                editingId={editingId}
                setEditingId={setEditingId}
                msg={msg}
                isMe={isMe}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            );
          })}

        {isTyping && (
          <div className="flex w-full justify-start animate-pulse">
            <div className="bg-white text-muted border border-border-light rounded-2xl rounded-bl-none px-4 py-2 text-xs italic">
              {activeUser?.name} is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t border-border-light flex items-center gap-3 shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={`Message @${activeUser?.username}...`}
          value={text}
          onChange={handleInputChange}
          className="flex-1 bg-chat border border-border-light rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/40 transition-all text-sidebar placeholder:text-muted/50"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-10 h-10 bg-sidebar text-white rounded-xl flex items-center justify-center hover:bg-brand-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
