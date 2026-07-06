import { useState } from "react";
import { useUpdateMember } from "../../hooks/update/useUpdateMember";

export function NicknameModal({
  conversationId,
  onClose,
}: {
  conversationId: string;
  onClose: () => void;
}) {
  const [nicknameValue, setNicknameValue] = useState("");
  const { nickname } = useUpdateMember(conversationId);

  const handleSubmit = () => {
    if (!nicknameValue.trim()) return;
    nickname.mutate(nicknameValue, {
      onSuccess: () => {
        onClose(); // close modal after success
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[#1A1B23]">
        Enter new nickname
      </label>
      <input
        value={nicknameValue}
        onChange={(e) => setNicknameValue(e.target.value)}
        placeholder="Type nickname..."
        className="w-full rounded-lg border border-[#E5E5E1] bg-[#FAFAF8] px-3 py-2 text-sm text-[#1A1B23] placeholder:text-[#9A9CA8] focus:border-[#00C2A8] focus:outline-none focus:ring-1 focus:ring-[#00C2A8]"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm text-[#9A9CA8] hover:bg-[#F2F2EF]"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-[#00C2A8] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#00a18c]"
        >
          Save
        </button>
      </div>
    </div>
  );
}
