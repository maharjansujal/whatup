import { useForm } from "react-hook-form";
import { Form } from "../form/form";
import { FormField } from "../form/formField";
import { Input } from "../shared/input";
import { Button } from "../shared/button";
import type { LoginDto } from "../../types/user";
import { usePostAuth } from "../../hooks/post/usePostAuth";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

type LoginFormData = {
  identifier: string;
  password: string;
};

export function LoginForm() {
  const methods = useForm<LoginFormData>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { login } = usePostAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const identifier = data.identifier.trim();

      const payload: LoginDto = {
        password: data.password,
      };

      // Basic email detection
      if (identifier.includes("@")) {
        payload.email = identifier;
      } else {
        payload.username = identifier;
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
      <FormField name="identifier" label="Email or Username" required>
        <Input type="text" placeholder="you@example.com or yourusername" />
      </FormField>

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
