import { useForm } from "react-hook-form";
import { usePostAuth } from "../hooks/post/usePostAuth";
import type { RegisterDto } from "../types/user";
import { AxiosError } from "axios";
import { RegisterForm } from "../components/forms/RegisterForm";

export function RegisterPage() {
  const { register } = usePostAuth();
  const methods = useForm<RegisterDto>({
    defaultValues: {
      username: "",
      display_name: "",
      email: "",
      password: "",
      avatar_url: "",
      bio: "",
    },
  });

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
        <RegisterForm methods={methods} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
