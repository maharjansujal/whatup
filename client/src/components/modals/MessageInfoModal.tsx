import { Check, CheckCheck } from "lucide-react";
import type { Receipt } from "../../types/receipt";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { Avatar } from "../common/Avatar";
import { Modal } from "../common/Modal";

function formatRelative(iso?: string | null) {
  if (!iso) return "";

  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function MessageInfoModal({
  receipts,
  onClose,
}: {
  receipts: Receipt[];
  onClose: () => void;
}) {
  const { getUserById } = useGetUsers();

  const seen = receipts.filter((r) => r.seen_at);
  const deliveredOnly = receipts.filter((r) => r.delivered_at && !r.seen_at);
  const pending = receipts.filter((r) => !r.delivered_at);

  const groups = [
    {
      label: "Seen",
      items: seen,
      icon: CheckCheck,
      iconColor: "text-[#00C2A8]",
    },
    {
      label: "Delivered",
      items: deliveredOnly,
      icon: Check,
      iconColor: "text-[#9A9CA8]",
    },
    { label: "Sent", items: pending, icon: null, iconColor: "" },
  ].filter((g) => g.items.length > 0);

  return (
    <Modal title="Message info" onClose={onClose}>
      <div className="w-75 space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="mb-1.5 flex items-center gap-1.5 px-1">
              {group.icon && (
                <group.icon size={13} className={group.iconColor} />
              )}
              <p className="font-['IBM_Plex_Mono'] text-[10.5px] uppercase tracking-wide text-[#9A9CA8]">
                {group.label}
              </p>
            </div>

            <div className="flex flex-col gap-0.5">
              {group.items.map((receipt) => {
                const user = getUserById(receipt.user_id.toString());
                const timestamp = receipt.seen_at ?? receipt.delivered_at;

                return (
                  <div
                    key={`${receipt.message_id}-${receipt.user_id}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5"
                  >
                    <Avatar
                      src={user?.avatar_url}
                      name={user?.display_name ?? "?"}
                      size="sm"
                    />
                    <p className="flex-1 truncate text-[13px] font-medium text-[#1A1B23]">
                      {user?.display_name ?? "Unknown user"}
                    </p>
                    {timestamp && (
                      <p className="shrink-0 text-[11px] text-[#9A9CA8]">
                        {formatRelative(timestamp)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
