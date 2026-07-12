import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";

import { Form } from "../form/form";
import { FormField } from "../form/formField";
import { Input } from "../shared/input";
import { Button } from "../shared/button";

export interface RegisterFormValues {
  username: string;
  display_name: string;
  email: string;
  password: string;
  avatar_url?: string;
  bio?: string;
}

interface RegisterFormProps {
  methods: UseFormReturn<RegisterFormValues>;
  onSubmit: SubmitHandler<RegisterFormValues>;
}

export function RegisterForm({ methods, onSubmit }: RegisterFormProps) {
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

      <FormField name="avatar_url" label="Avatar URL">
        <Input placeholder="https://example.com/avatar.png" />
      </FormField>

      <FormField name="bio" label="Bio">
        <Input placeholder="Tell us about yourself..." />
      </FormField>

      <Button type="submit">Register</Button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </Form>
  );
}
