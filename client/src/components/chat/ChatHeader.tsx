import type { User } from "../../hooks/useChatQueries";
import Avatar from "../ui/Avatar";

export const ChatHeader = ({ image, name }: User) => {
  return (
    <div className="flex gap-x-4 p-4">
      <Avatar image={image} />
      <div className="flex flex-col">
        <h3 className="font-semibold text-slate-200">{name}</h3>
        <p className="text-xs text-slate-400">Active Session</p>
      </div>
    </div>
  );
};
