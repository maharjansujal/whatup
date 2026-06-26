import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MessageSquare, Upload, User } from "lucide-react";
import { useAuth } from "../../hooks/post/useAuth";
import { Input } from "./Input";
import { Button } from "../shared/Button";
import { Link } from "react-router-dom";
import { normalizeError } from "../../utils/normalizeError";
import { useUpdateUser } from "../../hooks/update/useUpdateUser";

type Mode = "create" | "edit";

type FormValues = {
  name: string;
  username: string;
  password: string;
};

type Props = {
  mode?: Mode;
  initialValues?: {
    name: string;
    username: string;
    image?: string | null;
  };
  onFormSubmit?: () => void;
};

export function UserForm({
  mode = "create",
  initialValues,
  onFormSubmit,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = mode === "edit";

  const { registerUser, isRegisteringUser, registerError, isRegisterError } =
    useAuth();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();

  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.image || null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
          name: initialValues.name,
          username: initialValues.username,
          password: "",
        }
      : undefined,
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        username: initialValues.username,
        password: "",
      });

      setImagePreview(initialValues.image || null);
    }
  }, [initialValues, reset]);

  const errorMessage = normalizeError(registerError);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("password", data.password);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (isEdit) {
      await updateUser(formData);
    } else {
      await registerUser(formData);
    }
    if (onFormSubmit) onFormSubmit();
  };

  const isLoading = isRegisteringUser;

  return (
    <div className="w-full max-w-md bg-white p-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center mb-3">
          <MessageSquare size={26} />
        </div>

        <h1 className="text-2xl font-bold text-sidebar">
          {isEdit ? "Update Profile" : "Create Account"}
        </h1>

        <p className="text-sm text-muted mt-1">
          {isEdit
            ? "Update your profile information"
            : "Join to start real-time messaging"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Error */}
        {isRegisterError && errorMessage && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error font-medium">
            {errorMessage}
          </div>
        )}

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-2 pb-2">
          <span className="text-xs font-semibold text-sidebar/80 uppercase tracking-wide">
            Profile Picture
          </span>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="relative w-20 h-20 rounded-full border border-border-light bg-chat flex items-center justify-center overflow-hidden group hover:border-brand transition-colors"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-muted/60" size={28} />
            )}

            <div className="absolute inset-0 bg-sidebar/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
              <Upload size={16} />
            </div>
          </button>
        </div>

        {/* Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="Your name"
          disabled={isLoading}
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required",
          })}
        />

        {/* Username */}
        <Input
          label="Username"
          type="text"
          placeholder="Choose username"
          disabled={isLoading}
          error={errors.username?.message}
          {...register("username", {
            required: "Username is required",
          })}
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          placeholder={
            isEdit ? "Leave blank to keep current password" : "••••••••"
          }
          disabled={isLoading}
          error={errors.password?.message}
          {...register("password", {
            required: isEdit ? false : "Password is required",
            minLength: isEdit
              ? undefined
              : {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
          })}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={isUpdating || isRegisteringUser}
          className="w-full disabled:opacity-50"
          isLoading={isLoading}
        >
          {isEdit
            ? isUpdating
              ? "Updating..."
              : "Update Profile"
            : isRegisteringUser
              ? "Signing Up"
              : "Sign Up"}
        </Button>

        {mode === "create" && (
          <p className="text-center text-sm text-muted mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}
