import Avatar from "../ui/Avatar";

export const ChatHeader = ({
  image,
  name,
}: {
  image?: string;
  name: string;
}) => {
  return (
    <div className="flex gap-x-4 p-4">
      <Avatar image={image} />
      <div className="flex flex-col">
        <h3 className="font-semibold text-(--color-text-primary)">{name}</h3>
        <p className="text-xs text-(--color-text-secondary)">Active Session</p>
      </div>
    </div>
  );
};
