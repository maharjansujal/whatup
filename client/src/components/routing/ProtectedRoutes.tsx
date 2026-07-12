import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute() {
  const { authUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full justify-center items-center">
        <Loader2 /> Loading...
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
