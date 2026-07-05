import { useGetUsers } from "../../hooks/get/useGetUsers";
import { Avatar } from "../common/Avatar";

export function GroupAvatarStack({ memberIds }: { memberIds: string[] }) {
  const { users } = useGetUsers();
  const shown = memberIds.slice(0, 3);

  return (
    <div className="relative h-10 w-10 shrink-0">
      {shown.map((id, i) => {
        const user = users?.find((u) => u.id === id); // lookup directly
        return (
          <div
            key={id}
            className="absolute rounded-full ring-2 ring-[#12131C]"
            style={{
              left: i * 8,
              top: i * 6,
              zIndex: shown.length - i,
            }}
          >
            <Avatar
              src={user?.avatar_url}
              name={user?.display_name ?? "?"}
              size="sm"
            />
          </div>
        );
      })}
    </div>
  );
}
