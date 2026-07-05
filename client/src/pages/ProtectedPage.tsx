import { ChatWindow } from "../components/chat/ChatWindow";
import { Sidebar } from "../components/sidebar/Sidebar";

export function ProtectedPage() {
  return (
    <div className="flex h-screen w-full bg-[#FAFAF8]">
      {/* LEFT SIDEBAR */}
      <div className="flex w-[320px] flex-col">
        <Sidebar />
      </div>

      {/* CHAT AREA */}
      <div className="flex flex-1 flex-col">
        <ChatWindow />
      </div>
    </div>
  );
}
