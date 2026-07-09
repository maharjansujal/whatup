import { useChat } from "../../context/ChatContext";
import { useGetUsers } from "../../hooks/get/useGetUsers";

function TypingDots() {
  return (
    <span className="flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 animate-bounce rounded-full bg-[#00C2A8]"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export function TypingBubble() {
  const { activeConversationId, typingUsers } = useChat();
  const typing = typingUsers[activeConversationId ?? ""] ?? new Set();
  const { getUserById } = useGetUsers();

  const names = [...typing]
    .map((id) => getUserById(id)?.display_name)
    .filter((name): name is string => Boolean(name));

  if (names.length === 0) return null;

  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
        ? `${names[0]} and ${names[1]} are typing`
        : `${names[0]}, ${names[1]} and ${names.length - 2} others are typing`;

  return (
    <div className="flex items-center gap-2 px-6 py-1.5">
      <TypingDots />
      <span className="font-['IBM_Plex_Mono'] text-[11.5px] text-[#9A9CA8]">
        {label}
      </span>
    </div>
  );
}
