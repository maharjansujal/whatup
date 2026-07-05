import { Button } from "../components/shared/button";
import { Sidebar } from "../components/sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";

export function ProtectedPage() {
  const { authUser, logout } = useAuth();

  return (
    <div className="flex h-screen">
      <div className="flex flex-col justify-between border-r w-1/4">
        <Sidebar />
        <div className="p-4">
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4">
        <h2 className="text-lg font-semibold">
          Welcome, {authUser?.display_name ?? authUser?.username}
        </h2>
        <p className="text-gray-500">Chat area placeholder</p>
      </div>
    </div>
  );
}
