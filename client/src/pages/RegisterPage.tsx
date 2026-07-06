import { useForm } from "react-hook-form";
import { usePostAuth } from "../hooks/post/usePostAuth";
import type { RegisterDto } from "../types/user";
import { AxiosError } from "axios";
import { UserForm } from "../components/forms/UserForm";

export function RegisterPage() {
  const { register } = usePostAuth();
  const methods = useForm<RegisterDto>();

  const onSubmit = async (data: RegisterDto) => {
    try {
      await register(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        methods.setError("root", {
          message: error.response?.data.message ?? "Registration failed",
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Register</h1>
        <UserForm<RegisterDto>
          mode="create"
          methods={methods}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
