import { Outlet } from "react-router-dom";

import { SocketProvider } from "../context/SocketContext";
import { ChatProvider } from "../context/ChatContext";
import { ModalProvider } from "../context/ModalContext";

import { Sidebar } from "../components/sidebar/Sidebar";
import { ConfirmProvider } from "../components/shared/confirm/confirm-provider";

export function ProtectedPage() {
  return (
    <SocketProvider>
      <ChatProvider>
        <ModalProvider>
          <ConfirmProvider>
            <div className="flex h-screen w-full bg-[#FAFAF8]">
              {/* LEFT SIDEBAR */}
              <div className="flex flex-col">
                <Sidebar />
              </div>

              {/* PAGE CONTENT */}
              <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                <Outlet />
              </div>
            </div>
          </ConfirmProvider>
        </ModalProvider>
      </ChatProvider>
    </SocketProvider>
  );
}
