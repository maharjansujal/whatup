import type { User } from "../../types/user";

type SidebarUserItemProps = {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
};

export const SidebarUserItem = ({
  user,
  isSelected,
  onSelect,
}: SidebarUserItemProps) => {
  return (
    <button
      onClick={() => onSelect(user)}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected
          ? "bg-(--color-brand-primary) text-white"
          : "hover:bg-(--color-surface) text-(--color-text-secondary)"
      }`}
    >
      <div className="font-medium text-(--color-text-primary)">{user.name}</div>
      <div className="text-xs text-(--color-text-secondary)">
        @{user.username}
      </div>
    </button>
  );
};
