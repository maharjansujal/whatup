import { useForm } from "react-hook-form";
import { usePostAuth } from "../hooks/post/usePostAuth";
import { AxiosError } from "axios";
import {
  RegisterForm,
  type RegisterFormValues,
} from "../components/forms/RegisterForm";

export function RegisterPage() {
  const { register } = usePostAuth();
  const methods = useForm<RegisterFormValues>({
    defaultValues: {
      username: "",
      display_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Data to be submitted", data);
    try {
      await register({
        username: data.username,
        display_name: data.display_name,
        email: data.email,
        password: data.password,
        avatar: data.avatar?.[0],
      });
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
