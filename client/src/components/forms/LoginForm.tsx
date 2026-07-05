import { useForm } from "react-hook-form";
import { Form } from "../form/form";
import { FormField } from "../form/formField";
import { Input } from "../shared/input";
import { Button } from "../shared/button";
import type { LoginDto } from "../../types/user";
import { usePostAuth } from "../../hooks/post/usePostAuth";

export function LoginForm() {
  const methods = useForm<LoginDto>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = usePostAuth();

  return (
    <Form methods={methods} onSubmit={(data: LoginDto) => login(data)}>
      <FormField name="email" label="Email">
        <Input type="email" placeholder="you@example.com" />
      </FormField>

      <FormField name="password" label="Password">
        <Input type="password" placeholder="Enter your password" />
      </FormField>

      <Button type="submit">Login</Button>
    </Form>
  );
}
