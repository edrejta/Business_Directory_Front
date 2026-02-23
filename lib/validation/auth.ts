import { z } from "zod";

/** Vetëm User (0) lejohet në signup. */
export const registerSchema = z.object({
  username: z.string().min(1, "Emri i përdoruesit kërkohet"),
  email: z.string().email("Email i pavlefshëm"),
  password: z.string().min(8, "Fjalëkalimi duhet të jetë së paku 8 karaktere"),
  role: z.literal(0),
});

export const loginSchema = z.object({
  email: z.string().email("Email i pavlefshëm"),
  password: z.string().min(1, "Fjalëkalimi kërkohet"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
