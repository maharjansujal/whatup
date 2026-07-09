import { useUpdateMember } from "../../hooks/update/useUpdateMember";
import { useModal } from "../../context/ModalContext";

const DURATIONS = [
  { label: "1 hour", ms: 3600_000 },
  { label: "8 hours", ms: 8 * 3600_000 },
  { label: "1 day", ms: 24 * 3600_000 },
  { label: "1 week", ms: 7 * 24 * 3600_000 },
  { label: "Forever", ms: null }, // special case
];

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../shared/alert/useAlert";

export function MuteDurationMenu({
  conversationId,
}: {
  conversationId: string;
}) {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  if (!authUser) {
    navigate("/login");
    return null;
  }
  const { mute } = useUpdateMember(conversationId, authUser.id);
  const { closeModal } = useModal();
  const alert = useAlert();

  const handleClick = (ms: number | null) => {
    const mutedUntil =
      ms === null
        ? "9999-12-31T23:59:59Z" // forever mute
        : new Date(Date.now() + ms).toISOString();

    mute.mutate(mutedUntil, {
      onSuccess: () => {
        closeModal();
        alert.success("Conversation muted");
      }, // close after success
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {DURATIONS.map((d) => (
        <button
          key={d.label}
          onClick={() => handleClick(d.ms)}
          className="rounded-lg px-3 py-2 text-left text-[13px] hover:bg-[#F2F2EF]"
        >
          {d.label}
        </button>
      ))}

      {/* Cancel button */}
      <button
        onClick={closeModal}
        className="mt-2 rounded-lg px-3 py-2 text-[13px] text-[#9A9CA8] hover:bg-[#F2F2EF]"
      >
        Cancel
      </button>
    </div>
  );
}
