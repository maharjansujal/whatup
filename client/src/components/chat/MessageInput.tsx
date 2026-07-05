import { useState, type KeyboardEvent } from "react";
import { Paperclip, SendHorizontal, Smile } from "lucide-react";
import { useChat } from "../../context/ChatContext";

export function MessageInput() {
  const [value, setValue] = useState("");
  const { sendMessage } = useChat();

  const handleSend = () => {
    if (!value.trim()) return;
    sendMessage(value);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[#EEEEEB] bg-white px-6 py-3.5">
      <div className="flex items-end gap-2 rounded-2xl border border-[#E5E5E1] bg-[#FAFAF8] px-3 py-2">
        <button
          title="Attach a file"
          className="shrink-0 rounded-lg p-1.5 text-[#9A9CA8] transition-colors hover:bg-[#F2F2EF] hover:text-[#00C2A8]"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
          disabled={!value.trim()}
          title="Send"
          className="shrink-0 rounded-full bg-[#00C2A8] p-2 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          <SendHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
