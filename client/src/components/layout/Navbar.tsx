// src/components/layout/Navbar.tsx
import { LogOut, MessageSquare, Settings } from "lucide-react";
import { useAuth } from "../../hooks/post/useAuth";
import { Button } from "../shared/Button";
import { useModal } from "../../context/ModalContext";
import { UserForm } from "../form/UserForm";

export function Navbar() {
  const { logout } = useAuth();
  const { openModal, closeModal } = useModal();

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    logout();
  };

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
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
          <MessageSquare size={18} />
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
          <div className="flex items-center gap-2">
            <Button
              onClick={handleUpdateProfile}
              variant="secondary"
              className="text-sm"
              icon={<Settings />}
            >
              Update Profile
            </Button>

            <Button
              onClick={handleLogout}
              variant="danger"
              className="text-sm"
              icon={<LogOut />}
            >
              Log out
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
