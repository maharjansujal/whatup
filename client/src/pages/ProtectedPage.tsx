import { Button } from "../components/shared/button";
import { useGetAuth } from "../hooks/get/useGetAuth";
import { usePostAuth } from "../hooks/post/usePostAuth";

export function ProtectedPage() {
  const { data: authUser } = useGetAuth();
  const { logout, isLoggingOut } = usePostAuth();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold">Chats</h2>
          <p className="text-sm text-gray-500">Sidebar placeholder</p>
        </div>
        <Button
          variant="outline"
          onClick={() => logout()}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>

      {/* Chat area */}
      <div className="flex-1 p-4">
        <h2 className="text-lg font-semibold">
          Welcome, {authUser?.display_name ?? authUser?.username}
        </h2>
        <div className="mt-4 h-[80%] rounded border p-4">
          <p className="text-gray-500">Chat interface placeholder</p>
        </div>
      </div>
    </div>
  );
}
