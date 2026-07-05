import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute() {
  const { authUser, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (authUser === null) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
