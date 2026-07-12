import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";

import { Form } from "../form/form";
import { FormField } from "../form/formField";
import { FormItem } from "../form/formItem";
import { FormMessage } from "../form/formMessage";
import { Input } from "../shared/input";
import { Button } from "../shared/button";
import { Loader2 } from "lucide-react";

export interface RegisterFormValues {
  username: string;
  display_name: string;
  email: string;
  password: string;
  avatar?: FileList | null;
}

interface RegisterFormProps {
  methods: UseFormReturn<RegisterFormValues>;
  onSubmit: SubmitHandler<RegisterFormValues>;
  isRegistering: boolean;
}

export function RegisterForm({
  methods,
  onSubmit,
  isRegistering,
}: RegisterFormProps) {
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <FormField name="username" label="Username" required>
        <Input placeholder="Enter username" />
      </FormField>

      <FormField name="display_name" label="Display Name" required>
        <Input placeholder="Enter display name" />
      </FormField>

      <FormField name="email" label="Email" required>
        <Input type="email" placeholder="you@example.com" />
      </FormField>

      <FormField name="password" label="Password" required>
        <Input type="password" placeholder="Enter password" />
      </FormField>

      <FormItem label="Avatar">
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            methods.setValue("avatar", e.target.files ?? undefined)
          }
        />
        <FormMessage message={methods.formState.errors.avatar?.message} />
      </FormItem>

      <Button type="submit" disabled={isRegistering}>
        {isRegistering ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : (
          "Register"
        )}
      </Button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </Form>
  );
}
