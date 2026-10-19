import type { FormikErrors } from "formik";
import type { ZodType } from "zod";

export function zodToFormikErrors<T extends Record<string, unknown>>(
  schema: ZodType<T>,
  values: T,
): FormikErrors<T> {
  const result = schema.safeParse(values);
  if (result.success) {
    return {};
  }

  const errors: FormikErrors<T> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      (errors as Record<string, string>)[key] = issue.message;
    }
  }

  return errors;
}
