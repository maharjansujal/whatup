// src/components/layout/Navbar.tsx
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuth } from "../../hooks/post/useAuth";
import { useModal } from "../../context/ModalContext";
import { UserForm } from "../form/UserForm";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const { logout } = useAuth();
  const { openModal, closeModal } = useModal();

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUpdateProfile = () => {
    openModal(
      <UserForm
        mode="edit"
        initialValues={currentUser}
        onFormSubmit={closeModal}
      />,
    );
  };

  return (
    <nav className="h-16 w-full bg-sidebar text-white flex items-center justify-between px-6 border-b border-border-dark relative z-50">
      {/* Left side: Application Brand Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-auto aspect-square">
          <img
            src="/logo.webp"
            alt="Company logo"
            className="w-full h-full rounded-full"
          />
        </div>
        <span className="font-bold text-lg tracking-wide">Whatup</span>
      </div>

      {/* Right side: User Info + Actions */}
      {currentUser && (
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-brand-muted text-sidebar font-bold flex items-center justify-center border-2 border-brand overflow-hidden">
            {currentUser.image ? (
              <img
                src={currentUser.image}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{currentUser.name.charAt(0).toUpperCase()}</span>
            )}
          </div>

          {/* Name + Username */}
          <div className="flex flex-col leading-tight">
            <p className="text-sm font-bold">{currentUser.name}</p>
            <p className="text-xs text-muted">@{currentUser.username}</p>
          </div>

          {/* Actions */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-sidebar-light transition"
            >
              <ChevronDown
                size={20}
                className={`transition-transform duration-200 ${
                  isMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-fit text-xs rounded-lg bg-white shadow-lg border border-border-light overflow-hidden z-50">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleUpdateProfile();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sidebar hover:bg-chat transition whitespace-nowrap"
                >
                  <Settings size={18} />
                  Update Profile
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error/10 transition whitespace-nowrap"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
