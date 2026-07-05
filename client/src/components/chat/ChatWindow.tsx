import { MessageCircle } from "lucide-react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useChat } from "../../context/ChatContext";

export function ChatWindow() {
  const { activeConversation } = useChat();

  if (!activeConversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-[#FAFAF8]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F2F2EF]">
          <MessageCircle size={24} className="text-[#9A9CA8]" />
        </div>
        <p className="font-['Space_Grotesk'] text-[15px] font-medium text-[#1A1B23]">
          Select a conversation
        </p>
        <p className="max-w-xs text-center text-[13px] text-[#9A9CA8]">
          Choose someone from the sidebar, or start a new chat or group to begin
          messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#FAFAF8]">
      <ChatHeader conversation={activeConversation} />
      <MessageList />
      <MessageInput />
    </div>
  );
}
