import { z } from "zod";

export const RegisterSchema = z.object({
  username: z.string().min(3).max(30),

  display_name: z.string().min(2).max(100),

  email: z.email(),

  password: z.string().min(8),
});

export const LoginSchema = z
  .object({
    username: z.string().min(3).optional(),
    email: z.email().optional(),
    password: z.string().min(1),
  })
  .refine((data) => data.username || data.email, {
    message: "Either username or email is required",
    path: ["username"],
  });

export type LoginDto = z.infer<typeof LoginSchema>;

export type RegisterDto = z.infer<typeof RegisterSchema> & {
  avatar?: Express.Multer.File;
};
