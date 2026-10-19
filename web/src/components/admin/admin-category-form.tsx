"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import {
  AdminTable,
  adminTableCellClass,
} from "@/components/admin/admin-table";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";
import {
  loadAdminCategories,
  saveAdminCategory,
} from "@/lib/admin-catalog-storage";

type AdminCategoryFormProps = {
  view: "create" | "list";
};

export function AdminCategoryForm({ view }: AdminCategoryFormProps) {
  const router = useRouter();
  const labelId = useId();
  const slugId = useId();
  const [items, setItems] = useState(() => loadAdminCategories());
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function refresh() {
    setItems(loadAdminCategories());
  }

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

    form.reset();
    refresh();
    router.push("/admin/categories/list");
  }

  if (view === "create") {
    return (
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
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-navy">Added in this browser</h2>
      <AdminTable
        caption="Categories added in this browser"
        columns={["Label", "Slug"]}
        isEmpty={items.length === 0}
        emptyMessage="No categories added yet."
      >
        {items.map((item) => (
          <tr key={item.id}>
            <td className={`${adminTableCellClass} font-medium`}>{item.label}</td>
            <td className={adminTableCellClass}>
              <code className="text-xs text-muted">{item.slug}</code>
            </td>
          </tr>
        ))}
      </AdminTable>
    </section>
  );
}
