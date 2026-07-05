import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginForm } from "../components/forms/LoginForm";

export function LoginPage() {
  const { authUser, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (authUser) return <Navigate to="/" replace />; // prevent flicker

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
