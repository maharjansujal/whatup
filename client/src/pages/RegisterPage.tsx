import { useState } from "react";
import { Button } from "../components/ui/Button";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

type RegisterForm = {
  name: string;
  username: string;
  password: string;
  image: FileList;
};

export default function Register() {
  const { registerUser, isRegisteringUser } = useAuth();

  const { register, handleSubmit, reset } = useForm<RegisterForm>();

  const [error, setError] = useState("");

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError("");

      await registerUser({
        name: data.name,
        username: data.username,
        password: data.password,
        image: data.image?.[0],
      });

      reset();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Something went wrong",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <input {...register("username")} />
      <input {...register("password")} />

      <input type="file" {...register("image")} />

      <Button
        disabled={isRegisteringUser}
        text={isRegisteringUser ? "Loading..." : "Register"}
      ></Button>
      {error && <p>{error}</p>}
    </form>
  );
}
