import { z } from "zod";

const MAX_BOOK_IMAGE_SIZE = 500_000;
const BOOK_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

function validateBookImage(file: File | null, required: boolean): string | null {
  if (!file || file.size === 0) {
    return required ? "Cover image is required." : null;
  }

  if (file.size > MAX_BOOK_IMAGE_SIZE) {
    return "Cover image must be 500KB or smaller.";
  }

  if (!BOOK_IMAGE_TYPES.includes(file.type as (typeof BOOK_IMAGE_TYPES)[number])) {
    return "Cover image must be jpeg, png, or webp.";
  }

  return null;
}

export const createBookSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(200, "Title must be at most 200 characters."),
    categoryId: z.string().trim().min(1, "Category is required."),
    authorId: z.string().trim().min(1, "Author is required."),
    summary: z
      .string()
      .trim()
      .max(5000, "Summary must be at most 5000 characters."),
    image: z.custom<File | null>(
      (value) => value === null || value instanceof File,
      "Cover image is required.",
    ),
  })
  .superRefine((values, ctx) => {
    const message = validateBookImage(values.image, true);
    if (message) {
      ctx.addIssue({
        code: "custom",
        message,
        path: ["image"],
      });
    }
  });

export type CreateBookFormValues = z.infer<typeof createBookSchema>;

export const updateBookFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(200, "Title must be at most 200 characters."),
    categoryId: z.string().trim().min(1, "Category is required."),
    authorId: z.string().trim().min(1, "Author is required."),
    summary: z
      .string()
      .trim()
      .max(5000, "Summary must be at most 5000 characters."),
    image: z.custom<File | null>(
      (value) => value === null || value instanceof File,
    ),
  })
  .superRefine((values, ctx) => {
    const message = validateBookImage(values.image, false);
    if (message) {
      ctx.addIssue({
        code: "custom",
        message,
        path: ["image"],
      });
    }
  });

export type UpdateBookFormValues = z.infer<typeof updateBookFormSchema>;
