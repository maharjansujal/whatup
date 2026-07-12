import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Modal } from "../common/Modal";
import { Avatar } from "../common/Avatar";
import { Input } from "../shared/input";
import { Button } from "../shared/button";
import { useAuth } from "../../context/AuthContext";
import { useUpdateProfile } from "../../hooks/update/useUpdateProfile";

export function EditProfileModal({ onClose }: { onClose: () => void }) {
  const { authUser } = useAuth();
  const {
    updateAvatar,
    isUpdatingAvatar,
    avatarError,
    updatePassword,
    isUpdatingPassword,
    passwordError,
  } = useUpdateProfile();

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarSaved, setAvatarSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSaveAvatar = async () => {
    if (!avatar) return;

    await updateAvatar({ avatar });

    setAvatar(null);
    setAvatarSaved(true);

    setTimeout(() => setAvatarSaved(false), 2000);
  };

  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || passwordsMismatch) return;
    if (currentPassword === newPassword) {
      return;
    }
    await updatePassword({
      currentPassword,
      newPassword,
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  return (
    <Modal title="Edit profile" onClose={onClose}>
      <div className="space-y-6">
        {/* Avatar section */}
        <div>
          <p className="mb-2 text-[10.5px] uppercase tracking-wide text-[#9A9CA8]">
            Avatar
          </p>
          <div className="flex items-center gap-3">
            <Avatar
              src={avatar ? URL.createObjectURL(avatar) : authUser?.avatar_url}
              name={authUser?.display_name ?? ""}
              size="sm"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
              className="flex-1"
            />
          </div>
          {avatarError && (
            <p className="mt-1.5 text-[12px] text-red-500">
              {avatarError.message}
            </p>
          )}
          <Button
            onClick={handleSaveAvatar}
            disabled={isUpdatingAvatar || !avatar}
            className="mt-2 w-full"
          >
            {isUpdatingAvatar ? (
              <Loader2 size={14} className="animate-spin" />
            ) : avatarSaved ? (
              <span className="flex items-center justify-center gap-1.5">
                <Check size={14} /> Saved
              </span>
            ) : (
              "Save avatar"
            )}
          </Button>
        </div>

        <div className="border-t border-[#EEEEEB]" />

        {/* Password section */}
        <div>
          <p className="mb-2 font-['IBM_Plex_Mono'] text-[10.5px] uppercase tracking-wide text-[#9A9CA8]">
            Change password
          </p>
          <div className="space-y-2">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          {passwordsMismatch && (
            <p className="mt-1.5 text-[12px] text-red-500">
              Passwords don't match
            </p>
          )}
          {passwordError && (
            <p className="mt-1.5 text-[12px] text-red-500">
              {passwordError.message}
            </p>
          )}
          <Button
            onClick={handleSavePassword}
            disabled={
              isUpdatingPassword ||
              !currentPassword ||
              !newPassword ||
              passwordsMismatch
            }
            className="mt-2 w-full"
          >
            {isUpdatingPassword ? (
              <Loader2 size={14} className="animate-spin" />
            ) : passwordSaved ? (
              <span className="flex items-center justify-center gap-1.5">
                <Check size={14} /> Updated
              </span>
            ) : (
              "Update password"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
