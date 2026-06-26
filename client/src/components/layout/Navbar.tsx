// src/components/layout/Navbar.tsx
import { useState } from "react";
import { LogOut, MessageSquare, User } from "lucide-react";
import { useAuth } from "../../hooks/post/useAuth";

export function Navbar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Safely extract the current user metadata fed from localStorage
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="h-16 w-full bg-sidebar text-white flex items-center justify-between px-6 border-b border-border-dark relative z-50">
      {/* Left side: Application Brand Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
          <MessageSquare size={18} />
        </div>
        <span className="font-bold text-lg tracking-wide">Whatup</span>
      </div>

      {/* Right side: Interactive Avatar Action Element */}
      {currentUser && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-full bg-brand-muted text-sidebar font-bold flex items-center justify-center border-2 border-brand hover:scale-105 transition-transform overflow-hidden cursor-pointer focus:outline-none"
          >
            {currentUser.image ? (
              <img
                src={currentUser.image}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{currentUser.name.charAt(0).toUpperCase()}</span>
            )}
          </button>

          {/* Micro-Dropdown Profile Popup Panel */}
          {isOpen && (
            <>
              {/* Overlay curtain to click-away shut the panel */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-border-light text-sidebar p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-border-light mb-2.5">
                  <div className="w-9 h-9 bg-chat rounded-full flex items-center justify-center text-muted">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-muted truncate">
                      @{currentUser.username}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-sm font-medium text-error hover:bg-error/5 rounded-lg transition-colors text-left"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
