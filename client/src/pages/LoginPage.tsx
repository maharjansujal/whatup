import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser, isLoggingIn, loginError } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      await loginUser({ username, password });
      navigate("/chat");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-background)">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-6 rounded-xl border border-(--color-border) bg-(--color-surface) shadow-sm space-y-4"
      >
        <h2 className="text-2xl font-semibold text-(--color-text-primary)">
          Login
        </h2>

        <div className="space-y-2">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-(--color-border) bg-white text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary)"
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        {loginError && (
          <p className="text-sm text-[var(--color-danger)]">
            Invalid username or password
          </p>
        )}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full py-2 rounded-md font-medium transition
                     bg-[var(--color-btn-primary-bg)]
                     hover:bg-[var(--color-btn-primary-hover)]
                     text-[var(--color-btn-primary-text)]
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
