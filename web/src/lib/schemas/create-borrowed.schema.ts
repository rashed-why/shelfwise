import { z } from "zod";

export const createBorrowedSchema = z.object({
  userId: z.string().trim().min(1, "Select a borrower."),
  bookIds: z.array(z.string().trim().min(1)).min(1, "Select at least one book."),
  dueAt: z
    .string()
    .trim()
    .min(1, "Due date is required.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Due date is invalid."),
});

export type CreateBorrowedFormValues = z.infer<typeof createBorrowedSchema>;
