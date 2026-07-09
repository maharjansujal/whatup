import { useState } from "react";
import { Check, CheckCheck, FileText, Pencil, Trash2, X } from "lucide-react";
import { Avatar } from "../common/Avatar";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { useChat } from "../../context/ChatContext";
import type { Message } from "../../types/message";
import { useUpdateMessage } from "../../hooks/update/useUpdateMessage";
import { useDeleteMessage } from "../../hooks/delete/useDeleteMessage";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  isRead?: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar,
  isRead,
}: MessageBubbleProps) {
  const { getUserById } = useGetUsers();
  const { activeConversationId } = useChat();
  const sender = getUserById(message.sender_id);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content ?? "");

  const patchMessage = useUpdateMessage();
  const deleteMessage = useDeleteMessage();

  if (message.type === "system") {
    return (
      <div className="my-2 flex justify-center">
        <span className="rounded-full bg-[#F2F2EF] px-3 py-1 font-['IBM_Plex_Mono'] text-[11px] text-[#9A9CA8]">
          {message.content}
        </span>
      </div>
    );
  }

  const isDeleted = !!message.deleted_at;

  const handleSaveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === message.content || !activeConversationId) {
      setIsEditing(false);
      setDraft(message.content ?? "");
      return;
    }
    patchMessage.mutate(
      {
        messageId: message.id,
        conversationId: activeConversationId,
        content: trimmed,
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleCancelEdit = () => {
    setDraft(message.content ?? "");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!activeConversationId) return;
    if (!window.confirm("Delete this message?")) return;
    deleteMessage.mutate({
      messageId: message.id,
      conversationId: activeConversationId,
    });
  };

  return (
    <div
      className={`group flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
    >
      <div className="w-8 shrink-0">
        {!isOwn && showAvatar && (
          <Avatar
            src={sender?.avatar_url}
            name={sender?.display_name ?? "?"}
            size="sm"
          />
        )}
      </div>

      <div
        className={`flex max-w-[65%] flex-col ${isOwn ? "items-end" : "items-start"}`}
      >
        {!isOwn && showAvatar && (
          <span className="mb-1 px-1 text-[11.5px] font-medium text-[#8A8DA3]">
            {sender?.display_name}
          </span>
        )}

        <div className="flex items-center gap-1.5">
          {isOwn && !isEditing && !isDeleted && message.type !== "image" && (
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                title="Edit message"
                onClick={() => setIsEditing(true)}
                className="rounded-md p-1 text-[#9A9CA8] hover:bg-[#F2F2EF] hover:text-[#1A1B23]"
              >
                <Pencil size={13} />
              </button>
              <button
                title="Delete message"
                onClick={handleDelete}
                className="rounded-md p-1 text-[#9A9CA8] hover:bg-[#F2F2EF] hover:text-red-500"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}

          <div
            className={`rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
              isDeleted
                ? "bg-[#F2F2EF]/60 italic text-[#9A9CA8]"
                : isOwn
                  ? "rounded-br-md bg-[#00C2A8] text-white"
                  : "rounded-bl-md bg-[#F2F2EF] text-[#1A1B23]"
            }`}
          >
            {isDeleted ? (
              <p>This message was deleted</p>
            ) : (
              <>
                {message.attachments?.[0] && (
                  <img
                    src={message.attachments[0].file_url}
                    alt={message.attachments[0].filename}
                    className="mb-1 max-w-65 rounded-lg"
                  />
                )}

                {message.type === "file" && message.attachments?.[0] && (
                  <div
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${isOwn ? "bg-white/15" : "bg-white"}`}
                  >
                    <FileText
                      size={18}
                      className={isOwn ? "text-white" : "text-[#00C2A8]"}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium">
                        {message.attachments[0].filename}
                      </p>
                      <p
                        className={`text-[10.5px] ${isOwn ? "text-white/70" : "text-[#9A9CA8]"}`}
                      >
                        {formatFileSize(Number(message.attachments[0].size))}
                      </p>
                    </div>
                  </div>
                )}

                {message.content && !isEditing && (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}

                {isEditing && (
                  <div className="flex flex-col gap-1.5">
                    <textarea
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSaveEdit();
                        } else if (e.key === "Escape") {
                          handleCancelEdit();
                        }
                      }}
                      className="w-full resize-none rounded-lg bg-white/90 px-2 py-1.5 text-[13.5px] text-[#1A1B23] focus:outline-none"
                      rows={2}
                    />
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={handleCancelEdit}
                        className={`rounded-md p-1 ${isOwn ? "text-white/80 hover:bg-white/15" : "text-[#9A9CA8] hover:bg-white"}`}
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={patchMessage.isPending}
                        className={`rounded-md p-1 ${isOwn ? "text-white/80 hover:bg-white/15" : "text-[#9A9CA8] hover:bg-white"}`}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-1 flex items-center gap-1 px-1 font-['IBM_Plex_Mono'] text-[10px] text-[#B0B2BE]">
          <span>{formatTime(message.created_at)}</span>
          {message.updated_at && (
            <span title={`Edited at ${formatTime(message.updated_at)}`}>
              · Edited
            </span>
          )}
          {isOwn &&
            (isRead ? (
              <CheckCheck size={12} className="text-[#00C2A8]" />
            ) : (
              <Check size={12} />
            ))}
        </div>
      </div>
    </div>
  );
}
