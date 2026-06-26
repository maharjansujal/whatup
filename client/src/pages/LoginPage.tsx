import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/form/Input";
import { Button } from "../components/shared/Button";
import { MessageSquare } from "lucide-react";
import { useAuth } from "../hooks/post/useAuth";
import { normalizeError } from "../utils/normalizeError";
import { useForm } from "react-hook-form";
import { useState } from "react";

type LoginFormInputs = {
  username: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const { loginUser, isLoggingIn, loginError, isLoginError } = useAuth();
  const [showError, setShowError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  // Extract human-readable error messages from Axios / Server responses
  const errorMessage = normalizeError(loginError);

  const onSubmit = async (data: LoginFormInputs) => {
    setShowError(true);
    try {
      await loginUser(data);
      navigate("/");
    } catch {}
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {isLoginError && errorMessage && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error font-medium">
              {errorMessage}
            </div>
          )}

          <Input
            label="Username"
            type="text"
            placeholder="Enter your username"
            disabled={isLoggingIn}
            {...register("username", { required: "Username is required" })}
          />

          {showError && errors.username && (
            <p className="text-xs text-error mt-1">{errors.username.message}</p>
          )}

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            disabled={isLoggingIn}
            {...register("password", { required: "Password is required" })}
          />

          {showError && errors.password && (
            <p className="text-xs text-error mt-1">{errors.password.message}</p>
          )}

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
