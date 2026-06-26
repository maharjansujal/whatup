import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/shared/Button";
import { MessageSquare, Upload, User } from "lucide-react";
import { useAuth } from "../hooks/post/useAuth";
import { Input } from "../components/form/Input";

export function RegisterPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { registerUser, isRegisteringUser, registerError } = useAuth();

  // Field states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const errorMessage = registerError
    ? (registerError as any).response?.data?.message || "Registration failed"
    : "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Dynamic image element path preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !password) return;

    try {
      await registerUser({ name, username, password, image: imageFile });
      navigate("/login"); // Direct them back to login page to confirm credentials
    } catch (err) {
      // Handled by react-query error state
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-chat p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-border-light p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center mb-3">
            <MessageSquare size={26} />
          </div>
          <h1 className="text-2xl font-bold text-sidebar">Create Account</h1>
          <p className="text-sm text-muted mt-1">
            Join to start exchanging real-time messages
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error font-medium">
              {errorMessage}
            </div>
          )}

          {/* Integrated Interactive Profile Picture Input */}
          <div className="flex flex-col items-center gap-2 pb-2">
            <span className="text-xs font-semibold text-sidebar/80 uppercase tracking-wide">
              Profile Picture
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isRegisteringUser}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full border border-border-light bg-chat flex items-center justify-center overflow-hidden group hover:border-brand transition-colors focus:outline-none"
              disabled={isRegisteringUser}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User
                  className="text-muted/60 group-hover:text-brand transition-colors"
                  size={28}
                />
              )}
              <div className="absolute inset-0 bg-sidebar/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                <Upload size={16} />
              </div>
            </button>
          </div>

          <Input
            label="Full Name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isRegisteringUser}
            required
          />

          <Input
            label="Username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isRegisteringUser}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isRegisteringUser}
            required
          />

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isRegisteringUser}
          >
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
