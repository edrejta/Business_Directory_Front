import { z } from "zod";

export function normalizeUrl(input: string) {
  const v = input.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  return `https://${v}`;
}

function isValidUrlOrEmpty(value: string) {
  const v = value.trim();
  if (!v) return true;
  try {
    const normalized = normalizeUrl(v);
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
}

export const createBusinessSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name too long"),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(60, "City too long"),
  type: z.string().trim().min(2, "Type is required").max(60, "Type too long"),
  description: z.string().trim().max(2000, "Description too long").optional(),

  address: z.string().trim().min(3, "Address must be at least 3 characters").max(200, "Address too long").optional(),

  businessNumber: z
    .string()
    .trim()
    .min(3, "Business number must be at least 3 characters")
    .max(30, "Business number too long")
    .regex(/^[A-Za-z0-9-]+$/, "Business number can include letters, numbers, and '-' only"),

  businessUrl: z
    .string()
    .trim()
    .max(300, "URL too long")
    .refine(isValidUrlOrEmpty, "Please enter a valid URL (example: https://mybusiness.com)")
    .optional(),
});

export const updateBusinessSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  city: z.string().trim().min(2).max(60).optional(),
  type: z.string().trim().min(2).max(60).optional(),
  description: z.string().trim().max(2000).optional(),

  address: z.string().trim().min(3, "Address must be at least 3 characters").max(200, "Address too long").optional(),

  businessUrl: z
    .string()
    .trim()
    .max(300, "URL too long")
    .refine(isValidUrlOrEmpty, "Please enter a valid URL (example: https://mybusiness.com)")
    .optional(),
});

export type CreateBusinessFormValues = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessFormValues = z.infer<typeof updateBusinessSchema>;