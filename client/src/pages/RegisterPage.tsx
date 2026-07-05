import { useForm } from "react-hook-form";
import { UserForm } from "../components/forms/UserForm";
import { usePostAuth } from "../hooks/post/usePostAuth";
import type { RegisterDto } from "../types/user";

export function RegisterPage() {
  const { register } = usePostAuth();
  const methods = useForm<RegisterDto>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Register</h1>
        <UserForm<RegisterDto>
          mode="create"
          methods={methods}
          onSubmit={(data) => register(data)}
        />
      </div>
    </div>
  );
}
