import { Check, CheckCheck, FileText } from "lucide-react";
import { Avatar } from "../common/Avatar";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import type { Message } from "../../types/message";

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
  const sender = getUserById(message.sender_id);

  if (message.type === "system") {
    return (
      <div className="my-2 flex justify-center">
        <span className="rounded-full bg-[#F2F2EF] px-3 py-1 font-['IBM_Plex_Mono'] text-[11px] text-[#9A9CA8]">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
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

        <div
          className={`rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
            isOwn
              ? "rounded-br-md bg-[#00C2A8] text-white"
              : "rounded-bl-md bg-[#F2F2EF] text-[#1A1B23]"
          }`}
        >
          {message.type === "image" && message.attachments?.[0] && (
            <img
              src={message.attachments[0].thumbnail_url}
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

          {message.content && (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        <div
          className={`mt-1 flex items-center gap-1 px-1 font-['IBM_Plex_Mono'] text-[10px] text-[#B0B2BE]`}
        >
          <span>{formatTime(message.created_at)}</span>
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
