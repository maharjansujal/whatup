import { ChatWindow } from "../components/chat/ChatWindow";
import { Button } from "../components/shared/button";
import { Sidebar } from "../components/sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";

export function ProtectedPage() {
  const { authUser, logout } = useAuth();

  return (
    <div className="flex h-screen w-full bg-[#FAFAF8]">
      {/* LEFT SIDEBAR */}
      <div className="flex w-[320px] flex-col">
        <Sidebar />

        <div className="mt-auto border-t p-4">
          <Button variant="outline" onClick={logout} className="w-full">
            Logout
          </Button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex flex-1 flex-col">
        <ChatWindow />
      </div>
    </div>
  );
}
