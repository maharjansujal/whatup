import {
  Archive,
  BellOff,
  ChevronRight,
  LogOut,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { Modal } from "../common/Modal";
import type { Conversation } from "../../types/conversation";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[12.5px] text-[#9A9CA8]">{label}</span>
      <span className="text-[13px] font-medium text-[#1A1B23]">{value}</span>
    </div>
  );
}

function ActionRow({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-[#1A1B23] hover:bg-[#F2F2EF]"
      }`}
    >
      <span className={danger ? "text-red-500" : "text-[#9A9CA8]"}>{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRight size={14} className="text-[#C7C9D1]" />
    </button>
  );
}

export function ConversationInfoModal({
  conversation,
  onClose,
}: {
  conversation: Conversation;
  onClose: () => void;
}) {
  const isGroup = conversation.type === "group";

  return (
    <Modal title="Conversation info" onClose={onClose}>
      <div>
        <div className="mb-1 flex items-center gap-2 border-b border-[#EEEEEB] pb-3">
          <Users size={14} className="text-[#00C2A8]" />
          <p className="font-['Space_Grotesk'] text-[14.5px] font-semibold text-[#1A1B23]">
            {conversation.name ?? "Unnamed"}
          </p>
        </div>

        <div className="divide-y divide-[#F2F2EF] border-b border-[#EEEEEB] py-1">
          <InfoRow label="Type" value={isGroup ? "Group" : "Direct message"} />
          {isGroup && (
            <InfoRow
              label="Members"
              value={String(conversation.member_ids.length)}
            />
          )}
        </div>

        <div className="mt-2 flex flex-col gap-0.5">
          {isGroup && (
            <ActionRow icon={<Pencil size={16} />} label="Change nickname" />
          )}
          <ActionRow icon={<BellOff size={16} />} label="Mute notifications" />
          <ActionRow
            icon={<Archive size={16} />}
            label="Archive conversation"
          />
        </div>

        <div className="mt-3 flex flex-col gap-0.5 border-t border-[#EEEEEB] pt-2">
          {isGroup ? (
            <ActionRow icon={<LogOut size={16} />} label="Leave group" danger />
          ) : (
            <ActionRow
              icon={<Trash2 size={16} />}
              label="Delete conversation"
              danger
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
