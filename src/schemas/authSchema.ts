import { z } from "zod";

const register = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  name: z.string().optional(),
});

const verification = z.object({
  emailVerificationToken: z.string().min(1, "Verification token is required"),
  // Optionally add UUID validation if you're using UUIDs:
  // .uuid("Invalid verification token format")
});

const login = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const authSchema = {
  register,
  verification,
  login,
};
export default authSchema;

export type UserCreateInput = z.infer<typeof register>;
export type RegisterInput = z.infer<typeof register>;
export type LoginInput = z.infer<typeof login>;
