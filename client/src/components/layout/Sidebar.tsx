import type { User } from "../../types/user";
import { Button } from "../ui/Button";
import { SidebarUserItem } from "./SidebarMenu";

export const Sidebar = ({
  selectedUser,
  onSelectUser,
  currentUser,
  onLogout,
  chatList,
}: {
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  currentUser: User;
  onLogout: () => void;
  chatList: User[];
}) => {
  return (
    <div
      className="w-80 border-r flex flex-col"
      style={{
        backgroundColor: "var(--color-sidebar)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="p-4 border-b flex justify-between items-center"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div>
          <h2 className="font-bold text-lg text-(--color-text-primary)">
            {currentUser.name}
          </h2>
          <p className="text-xs text-(--color-text-secondary)">
            @{currentUser.username}
          </p>
        </div>

        <Button variant="danger" text="Exit" size="sm" onClick={onLogout} />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <h3 className="text-xs font-semibold uppercase px-2 my-2 text-(--color-text-secondary)">
          Active Users
        </h3>

        {chatList.map((user) => (
          <SidebarUserItem
            key={user.id}
            user={user}
            isSelected={selectedUser?.id === user.id}
            onSelect={onSelectUser}
          />
        ))}
      </div>
    </div>
  );
};
