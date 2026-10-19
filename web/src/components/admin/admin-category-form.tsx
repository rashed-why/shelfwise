"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";
import {
  loadAdminCategories,
  saveAdminCategory,
  type AdminCategory,
} from "@/lib/admin-catalog-storage";

export function AdminCategoryForm() {
  const labelId = useId();
  const slugId = useId();
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setItems(loadAdminCategories());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = saveAdminCategory({
      label: String(formData.get("label") ?? ""),
      slug: String(formData.get("slug") ?? "") || undefined,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setStatus({ type: "error", text: result.error });
      return;
    }

    setStatus({
      type: "success",
      text: `Added category "${result.category.label}".`,
    });
    form.reset();
    setItems(loadAdminCategories());
  }

  return (
    <div className="space-y-8">
      <form
        className="w-full space-y-4 rounded-xl border border-border bg-white p-5 sm:p-6"
        onSubmit={handleSubmit}
      >
        <div>
          <h2 className="text-lg font-semibold text-navy">New category</h2>
          <p className="mt-1 text-sm text-muted">
            Saved in this browser only (local storage). Slug is optional.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor={labelId} className={authLabelClass}>
            Label
          </label>
          <input
            id={labelId}
            name="label"
            required
            placeholder="Science & Nature"
            className={authFieldClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={slugId} className={authLabelClass}>
            Slug (optional)
          </label>
          <input
            id={slugId}
            name="slug"
            placeholder="science-nature"
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            className={authFieldClass}
          />
        </div>

        {status ? (
          <p
            role="status"
            className={`text-sm ${status.type === "success" ? "text-brand-teal" : "text-red-600"}`}
          >
            {status.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${authSubmitClass} max-w-xs`}
        >
          {isSubmitting ? "Saving…" : "Add category"}
        </button>
      </form>

      <section>
        <h3 className="text-sm font-semibold text-navy">Added in this browser</h3>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No categories added yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-white">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm"
              >
                <span className="font-medium text-navy">{item.label}</span>
                <code className="text-xs text-muted">{item.slug}</code>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
