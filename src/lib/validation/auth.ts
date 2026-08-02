import { z } from "zod";

/** Credentials schema, shared by the login form and the sign-in Server Action. */
export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email address.")
    .email("That does not look like a valid email address."),
  password: z.string().min(8, "Passwords are at least 8 characters."),
});

export type SignInInput = z.infer<typeof signInSchema>;
