import { useRef, useState, type KeyboardEvent } from "react";
import { Paperclip, SendHorizontal, Smile } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import socket from "../../socket/socket";
import { SOCKET_EVENTS } from "../../socket/socket_events";

export function MessageInput() {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { sendMessage, activeConversationId } = useChat();

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const typingTimeout = useRef<number | null>(null);
  const isTyping = useRef(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const canSend = value.trim().length > 0 || files.length > 0;

  const handleSend = () => {
    if (!canSend) return;
    sendMessage({
      content: value,
      files,
    });
    setFiles([]);
    setValue("");
  };
  return (
    <div className="border-t border-[#EEEEEB] bg-white px-6 py-3.5">
      <div className="flex items-end gap-2 rounded-2xl border border-[#E5E5E1] bg-[#FAFAF8] px-3 py-2">
        <button
          type="button"
          title="Attach a file"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 rounded-lg p-1.5 text-[#9A9CA8] transition-colors hover:bg-[#F2F2EF] hover:text-[#00C2A8]"
        >
          <Paperclip size={18} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFileChange}
        />

        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);

            if (!activeConversationId) return;

            if (!isTyping.current) {
              socket.emit(SOCKET_EVENTS.TYPING_START, {
                conversationId: activeConversationId,
              });

              isTyping.current = true;
            }

            if (typingTimeout.current) {
              clearTimeout(typingTimeout.current);
            }

            typingTimeout.current = window.setTimeout(() => {
              socket.emit(SOCKET_EVENTS.TYPING_STOP, {
                conversationId: activeConversationId,
              });

              isTyping.current = false;
            }, 1500);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          rows={1}
          className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-[13.5px] text-[#1A1B23] placeholder:text-[#9A9CA8] focus:outline-none"
        />

        <button
          title="Emoji"
          className="shrink-0 rounded-lg p-1.5 text-[#9A9CA8] transition-colors hover:bg-[#F2F2EF] hover:text-[#00C2A8]"
        >
          <Smile size={18} />
        </button>

        <button
          onClick={handleSend}
          disabled={!canSend}
          title="Send"
          className="shrink-0 rounded-full bg-[#00C2A8] p-2 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          <SendHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
