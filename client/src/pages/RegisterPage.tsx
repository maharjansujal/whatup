import { UserForm } from "../components/form/UserForm";

export function RegisterPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-chat p-4">
      <div className="w-full flex flex-col items-center">
        <UserForm mode="create" />
      </div>
    </div>
  );
}
