import { Navigate, Outlet } from "react-router-dom";
import { useGetAuth } from "../../hooks/get/useGetAuth";

export function ProtectedRoute() {
  const { data: authUser, isLoading } = useGetAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
