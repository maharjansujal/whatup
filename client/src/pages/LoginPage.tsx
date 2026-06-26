import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/form/Input";
import { Button } from "../components/shared/Button";
import { MessageSquare } from "lucide-react";
import { useAuth } from "../hooks/post/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginUser, isLoggingIn, loginError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Extract human-readable error messages from Axios / Server responses
  const errorMessage = loginError
    ? (loginError as any).response?.data?.message || "Invalid credentials"
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    try {
      await loginUser({ username, password });
      navigate("/"); // Redirect to dashboard layout on success
    } catch (err) {
      // Handled by react-query mutation error state
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-chat p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-border-light p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center mb-3">
            <MessageSquare size={26} />
          </div>
          <h1 className="text-2xl font-bold text-sidebar">Welcome Back</h1>
          <p className="text-sm text-muted mt-1">
            Sign in to continue your conversations
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error font-medium">
              {errorMessage}
            </div>
          )}

          <Input
            label="Username"
            type="text"
            placeholder="enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoggingIn}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoggingIn}
            required
          />

          <Button type="submit" className="w-full mt-2" isLoading={isLoggingIn}>
            Sign In
          </Button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-brand font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
