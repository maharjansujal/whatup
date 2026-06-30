import { Check, ChevronDown, LogOut, Settings } from "lucide-react";
import { useModal } from "../../context/ModalContext";
import { UserForm } from "../form/UserForm";
import { useEffect, useRef, useState } from "react";
import { usePostAuth } from "../../hooks/post/usePostAuth";
import { Avatar, PresenceDot } from "../shared/Avatar";
import type { Mode, Status } from "../../types/user";
import { useUpdateStatus } from "../../hooks/update/useUpdateStatus";
import { useCurrentUser } from "../../hooks/get/useCurrentUser";

interface StatusOption {
  id: "auto" | "idle" | "away" | "do-not-disturb";
  label: string;
  description: string;
  colorClass: string;
  // What payload gets sent to the backend
  value: {
    status_mode: Mode;
    custom_status: Status | null;
  };
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    id: "auto",
    label: "Automatic",
    description: "Based on chat activity",
    colorClass: "bg-green-500",
    value: { status_mode: "auto", custom_status: null },
  },
  {
    id: "do-not-disturb",
    label: "Do not disturb",
    description: "Mute chat notifications",
    colorClass: "bg-red-500",
    value: { status_mode: "manual", custom_status: "do-not-disturb" },
  },
  {
    id: "idle",
    label: "Idle",
    description: "",
    colorClass: "bg-orange-400",
    value: { status_mode: "manual", custom_status: "idle" },
  },
  {
    id: "away",
    label: "Set as away",
    description: "",
    colorClass: "bg-gray-400",
    value: { status_mode: "manual", custom_status: "away" },
  },
];

export function Navbar() {
  const { logout } = usePostAuth();
  const { openModal, closeModal } = useModal();

  const { currentUser } = useCurrentUser();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const { updateStatus } = useUpdateStatus();

  const currentStatusConfig =
    STATUS_OPTIONS.find((option) => {
      if (currentUser?.status_mode === "auto") {
        return option.id === "auto";
      }
      return option.value.custom_status === currentUser?.custom_status;
    }) || STATUS_OPTIONS[0];

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(target)) {
        setIsStatusOpen(false);
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
        initialValues={currentUser!}
        onFormSubmit={closeModal}
      />,
    );
  };

  const handleStatusChange = async (value: {
    status_mode: Mode;
    custom_status: Status | null;
  }) => {
    try {
      await updateStatus(value);
      setIsStatusOpen(false);
    } catch (err) {
      console.error("Failed to update user presence settings:", err);
    }
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
        <span className="font-bold text-lg tracking-wide">
          Moonlight Jyaasa
        </span>
      </div>

      {/* Right side: User Info + Actions */}
      {currentUser && (
        <div className="flex items-center gap-4">
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => setIsStatusOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sidebar-light hover:bg-sidebar-light/80 transition text-xs font-semibold"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${currentStatusConfig?.colorClass || "bg-green-500"}`}
              />
              <span>{currentStatusConfig?.label || "Automatic"}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isStatusOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-[#1e1f22] border border-neutral-800 p-1.5 shadow-xl z-50 text-left">
                {STATUS_OPTIONS.map((option) => {
                  const isSelected =
                    (currentUser.custom_status ?? "online") === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleStatusChange(option.value)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-neutral-800 transition text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-3 h-3 rounded-full shrink-0 ${option.colorClass}`}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-200">
                            {option.label}
                          </span>
                          {option.description && (
                            <span className="text-xs text-neutral-400">
                              {option.description}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-gray-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar
              image={currentUser.image}
              name={currentUser.name}
              size="sm"
              className="border-2 border-brand bg-brand-muted text-sidebar font-bold"
            />

            <PresenceDot presence={currentUser.custom_status ?? "online"} />
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
