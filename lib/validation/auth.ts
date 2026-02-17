import { z } from "zod";

/** Vetëm User (0) dhe BusinessOwner (1). Admin (2) nuk lejohet në signup. */
export const registerSchema = z.object({
  username: z.string().min(1, "Emri i përdoruesit kërkohet"),
  email: z.string().email("Email i pavlefshëm"),
  password: z.string().min(8, "Fjalëkalimi duhet të jetë së paku 8 karaktere"),
  role: z.union([z.literal(0), z.literal(1)], {
    errorMap: () => ({ message: "Zgjidhni një rol të vlefshëm" }),
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Email i pavlefshëm"),
  password: z.string().min(1, "Fjalëkalimi kërkohet"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
