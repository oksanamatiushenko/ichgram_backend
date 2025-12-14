// import * as z from "zod";
// import { emailRegex, passwordRegex, passwordMessage } from "../constants/auth.constants.js";

// export const emailSchema = z
//   .string()
//   .trim()
//   .min(1, "Email is required")
//   .max(254, "Email is too long")
//   .regex(emailRegex, "Please enter a valid email");

// export const passwordSchema = z
//   .string()
//   .trim()
//   .min(8, "Password must be at least 8 characters")
//   .regex(passwordRegex, passwordMessage);

// export const usernameSchema = z
//   .string()
//   .trim()
//   .min(3, "Username must be at least 3 characters")
//   .max(30, "Username must be at most 30 characters")
//   .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores");

// export const fullnameSchema = z
//   .string()
//   .trim()
//   .min(1, "Full name is required")
//   .max(50, "Full name is too long");

// export const registerSchema = z.object({
//   email: emailSchema,
//   fullname: fullnameSchema,
//   username: usernameSchema,
//   password: passwordSchema,
// });
// export type RegisterPayload = z.infer<typeof registerSchema>;

// export const loginSchema = z.object({
//   email: emailSchema,
//   password: passwordSchema,
// });
// export type LoginPayload = z.infer<typeof loginSchema>;

// export const changePasswordSchema = z.object({
//   oldPassword: passwordSchema,
//   newPassword: passwordSchema,
// });
// export type ChangePasswordPayload = z.infer<typeof changePasswordSchema>;

// export const resetPasswordSchema = z.object({
//   verificationCode: z.string().trim().min(1, "Verification code is required"),
//   newPassword: passwordSchema,
// });

// export const verifyCodeSchema = z.object({
//   code: z.string().trim().min(1, "Code is required"),
// });
