import { z } from "zod";

const categorySlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createCategorySchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Label is required.")
    .max(120, "Label must be at most 120 characters."),
  slug: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || categorySlugPattern.test(value),
      "Slug must use lowercase letters, numbers, and hyphens.",
    ),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

export const updateCategoryFormSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Label is required.")
    .max(120, "Label must be at most 120 characters."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(120, "Slug must be at most 120 characters.")
    .refine(
      (value) => categorySlugPattern.test(value),
      "Slug must use lowercase letters, numbers, and hyphens.",
    ),
});

export type UpdateCategoryFormValues = z.infer<typeof updateCategoryFormSchema>;
