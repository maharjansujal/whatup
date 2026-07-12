import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute() {
  const { authUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-75 w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading, please wait...</p>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
