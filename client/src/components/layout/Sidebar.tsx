import type { User } from "../../hooks/useChatQueries";
import { Button } from "../ui/Button";

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
    <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-950">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">{currentUser.name}</h2>
          <p className="text-xs text-slate-400">@{currentUser.username}</p>
        </div>
        <Button
          variant="danger"
          text="Exit"
          size="sm"
          onClick={onLogout}
        ></Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <h3 className="text-xs font-semibold text-slate-500 uppercase px-2 my-2">
          Active Users
        </h3>
        {chatList.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedUser?.id === user.id
                ? "bg-indigo-600 text-white"
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-slate-400">@{user.username}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
