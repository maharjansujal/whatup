import { Check, Pencil, Trash2, X } from "lucide-react";
import type { MessageItem } from "../../hooks/get/useFetchMessages";

interface ChatBubbleProps {
  msg: MessageItem;
  isMe: boolean;
  editingId: number | null;
  editedText: string;
  setEditedText: React.Dispatch<React.SetStateAction<string>>;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  onUpdate: (id: number) => void;
  onDelete: (id: number) => void;
}
export const ChatBubble = ({
  msg,
  isMe,
  editingId,
  editedText,
  setEditedText,
  setEditingId,
  onUpdate,
  onDelete,
}: ChatBubbleProps) => {
  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`group relative max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
          isMe
            ? "bg-sidebar text-white rounded-br-none"
            : "bg-white text-sidebar border border-border-light rounded-bl-none"
        }`}
      >
        {editingId === msg.id ? (
          <div className="space-y-2">
            <input
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
            />

            <div className="flex gap-2">
              <button onClick={() => onUpdate(msg.id)}>
                <Check size={14} />
              </button>

              <button onClick={() => setEditingId(null)}>
                <X size={14} className="text-error" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="leading-relaxed wrap-break-word">{msg.content}</p>

            {isMe && (
              <div className="absolute -top-2 -right-2 hidden gap-1 rounded bg-brand p-1 shadow group-hover:flex">
                <button
                  onClick={() => {
                    setEditingId(msg.id);
                    setEditedText(msg.content);
                  }}
                >
                  <Pencil size={14} />
                </button>

                <button onClick={() => onDelete(msg.id)}>
                  <Trash2 size={14} className="text-error" />
                </button>
              </div>
            )}

            <div
              className={`mt-2 flex items-center justify-end gap-2 text-[10px] ${
                isMe ? "text-white/70" : "text-muted"
              }`}
            >
              {msg.updated_at && <span className="italic">edited</span>}

              <span>
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
