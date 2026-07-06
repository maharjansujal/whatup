import type {
  DefaultValues,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

import { Form } from "../form/form";
import { FormField } from "../form/formField";
import { Input } from "../shared/input";
import { Button } from "../shared/button";
import { Link } from "react-router-dom";

type Mode = "create" | "edit";

interface UserFormFields extends FieldValues {
  username: string;
  display_name?: string;
  email?: string;
  password?: string;
  avatar_url?: string;
  bio?: string;
}

interface UserFormProps<T extends UserFormFields> {
  mode: Mode;
  methods: UseFormReturn<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
}

export function UserForm<T extends UserFormFields>({
  mode,
  methods,
  onSubmit,
}: UserFormProps<T>) {
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

      {mode === "create" && (
        <FormField name="password" label="Password" required>
          <Input type="password" placeholder="Enter password" />
        </FormField>
      )}

      <FormField name="avatar_url" label="Avatar URL">
        <Input placeholder="https://example.com/avatar.png" />
      </FormField>

      <FormField name="bio" label="Bio">
        <Input placeholder="Tell us about yourself..." />
      </FormField>

      <Button type="submit">
        {mode === "create" ? "Register" : "Update Profile"}
      </Button>

      {mode === "create" && (
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      )}
    </Form>
  );
}
