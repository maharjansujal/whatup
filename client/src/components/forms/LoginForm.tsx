import { useForm } from "react-hook-form";
import { Form } from "../form/form";
import { FormField } from "../form/formField";
import { Input } from "../shared/input";
import { Button } from "../shared/button";
import type { LoginDto } from "../../types/user";
import { usePostAuth } from "../../hooks/post/usePostAuth";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

export function LoginForm() {
  const methods = useForm<LoginDto>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { login } = usePostAuth();

  const onSubmit = async (data: LoginDto) => {
    try {
      const payload: LoginDto = {
        password: data.password,
      };

      if (data.username?.trim()) {
        payload.username = data.username.trim();
      }

      if (data.email?.trim()) {
        payload.email = data.email.trim();
      }

      await login(payload);
    } catch (error) {
      if (error instanceof AxiosError) {
        methods.setError("root", {
          message: error.response?.data.message ?? "Login failed",
        });
      }
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <div className="flex w-full gap-x-4">
        <FormField name="email" label="Email">
          <Input type="email" placeholder="you@example.com" />
        </FormField>
        <FormField name="username" label="Username">
          <Input type="username" placeholder="yourusername" />
        </FormField>
      </div>

      <FormField name="password" label="Password" required>
        <Input type="password" placeholder="Enter your password" />
      </FormField>

      <div className="flex justify-center w-full"></div>

      <div className="mt-4 flex flex-col items-center">
        <Button type="submit">Login</Button>

        {methods.formState.errors.root && (
          <p className="mt-2 text-center text-sm text-red-500">
            {methods.formState.errors.root.message}
          </p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </Form>
  );
}
