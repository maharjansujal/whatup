import { MessageSquare } from "lucide-react";
import { useChatSocket } from "../../context/SocketContext";
import { ChatWindow } from "./ChatWindow";
import { Sidebar } from "../layout/Sidebar";

export function ChatMainWorkspace() {
  const { activeUser, setActiveUser } = useChatSocket();

  return (
    <div className="flex-1 flex overflow-hidden w-full h-full">
      <Sidebar onSelectUser={setActiveUser} selectedUser={activeUser} />

      <main className="flex-1 h-full bg-chat relative flex flex-col overflow-hidden">
        {activeUser ? (
          <ChatWindow />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
            <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center shadow-xs">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-lg font-bold text-sidebar">No Chat Active</h3>
            <p className="text-sm text-muted max-w-xs">
              Select a contact from the sidebar directory directory panel to
              start exchanging real-time messages.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
