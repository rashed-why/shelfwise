import { z } from "zod";

const authorSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createAuthorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name must be at most 120 characters."),
  slug: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || authorSlugPattern.test(value),
      "Slug must use lowercase letters, numbers, and hyphens.",
    ),
});

export type CreateAuthorFormValues = z.infer<typeof createAuthorSchema>;

export const updateAuthorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name must be at most 120 characters."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(120, "Slug must be at most 120 characters.")
    .refine(
      (value) => authorSlugPattern.test(value),
      "Slug must use lowercase letters, numbers, and hyphens.",
    ),
});

export type UpdateAuthorFormValues = z.infer<typeof updateAuthorFormSchema>;
