"use client";

import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import {
  AdminTable,
  adminTableCellClass,
} from "@/components/admin/admin-table";
import {
  authFieldClass,
  authLabelClass,
  authSubmitClass,
} from "@/lib/auth-form-styles";
import type { CategoryRecord } from "@/lib/categories-api";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/lib/queries/categories";
import {
  createCategorySchema,
  updateCategoryFormSchema,
  type CreateCategoryFormValues,
  type UpdateCategoryFormValues,
} from "@/lib/schemas/create-category.schema";
import { zodToFormikErrors } from "@/lib/zod-formik";
import { notifyErrorFromUnknown, notifySuccess } from "@/lib/toast";
import { useNotifyQueryError } from "@/lib/use-notify-query-error";

type AdminCategoryFormProps = {
  view: "create" | "list";
};

const createInitialValues: CreateCategoryFormValues = {
  label: "",
  slug: "",
};

function AdminCategoryCreateForm() {
  const router = useRouter();
  const labelId = useId();
  const slugId = useId();
  const createCategory = useCreateCategoryMutation();

  return (
    <Formik
      initialValues={createInitialValues}
      validate={(values) => zodToFormikErrors(createCategorySchema, values)}
      onSubmit={(values, { resetForm }) => {
        createCategory.mutate(values, {
          onSuccess: () => {
            notifySuccess("Category created successfully.");
            resetForm();
            router.push("/admin/categories/list");
          },
          onError: (mutationError) => {
            notifyErrorFromUnknown(mutationError, "Could not create category.");
          },
        });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form
          className="w-full space-y-4 rounded-xl border border-border bg-white p-5 sm:p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <h2 className="text-lg font-semibold text-navy">New category</h2>
            <p className="mt-1 text-sm text-muted">
              Creates a category via{" "}
              <code className="text-xs">POST /category</code>. Slug is
              optional—the API generates one from the label when omitted.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor={labelId} className={authLabelClass}>
              Label
            </label>
            <input
              id={labelId}
              name="label"
              value={values.label}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Science & Nature"
              className={authFieldClass}
              aria-invalid={Boolean(touched.label && errors.label)}
            />
            {touched.label && errors.label ? (
              <p className="text-sm text-red-600">{errors.label}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor={slugId} className={authLabelClass}>
              Slug (optional)
            </label>
            <input
              id={slugId}
              name="slug"
              value={values.slug}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="science-nature"
              className={authFieldClass}
              aria-invalid={Boolean(touched.slug && errors.slug)}
            />
            {touched.slug && errors.slug ? (
              <p className="text-sm text-red-600">{errors.slug}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || createCategory.isPending}
            className={`${authSubmitClass} max-w-xs`}
          >
            {isSubmitting || createCategory.isPending ? "Saving…" : "Add category"}
          </button>
        </form>
      )}
    </Formik>
  );
}

type AdminCategoryEditPanelProps = {
  category: CategoryRecord;
  onCancel: () => void;
  onSaved: () => void;
};

function AdminCategoryEditPanel({
  category,
  onCancel,
  onSaved,
}: AdminCategoryEditPanelProps) {
  const labelId = useId();
  const slugId = useId();
  const updateCategory = useUpdateCategoryMutation();

  const initialValues: UpdateCategoryFormValues = {
    label: category.label,
    slug: category.slug,
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validate={(values) => zodToFormikErrors(updateCategoryFormSchema, values)}
      onSubmit={(values) => {
        updateCategory.mutate(
          { id: category.id, values },
          {
            onSuccess: () => {
              notifySuccess("Category updated successfully.");
              onSaved();
            },
            onError: (mutationError) => {
              notifyErrorFromUnknown(mutationError, "Could not update category.");
            },
          },
        );
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form
          className="space-y-4 rounded-xl border border-brand-teal/30 bg-brand-teal/5 p-5 sm:p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <h2 className="text-lg font-semibold text-navy">Edit category</h2>
            <p className="mt-1 text-sm text-muted">
              Updates via <code className="text-xs">PATCH /category/{category.id}</code>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={labelId} className={authLabelClass}>
                Label
              </label>
              <input
                id={labelId}
                name="label"
                value={values.label}
                onChange={handleChange}
                onBlur={handleBlur}
                className={authFieldClass}
                aria-invalid={Boolean(touched.label && errors.label)}
              />
              {touched.label && errors.label ? (
                <p className="text-sm text-red-600">{errors.label}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor={slugId} className={authLabelClass}>
                Slug
              </label>
              <input
                id={slugId}
                name="slug"
                value={values.slug}
                onChange={handleChange}
                onBlur={handleBlur}
                className={authFieldClass}
                aria-invalid={Boolean(touched.slug && errors.slug)}
              />
              {touched.slug && errors.slug ? (
                <p className="text-sm text-red-600">{errors.slug}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting || updateCategory.isPending}
              className={`${authSubmitClass} w-auto max-w-none px-6`}
            >
              {isSubmitting || updateCategory.isPending ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-brand-teal/5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}

function AdminCategoryList() {
  const { data: items = [], isLoading, isError, error } = useCategoriesQuery();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingCategory =
    editingId === null
      ? null
      : items.find((item) => item.id === editingId) ?? null;

  useNotifyQueryError(isError, error, "Could not load categories.");

  if (isLoading) {
    return <p className="text-sm text-muted">Loading categories…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-muted">
        Could not load categories. Try refreshing the page.
      </p>
    );
  }

  return (
    <section className="space-y-4">
      {editingCategory ? (
        <AdminCategoryEditPanel
          key={editingCategory.id}
          category={editingCategory}
          onCancel={() => setEditingId(null)}
          onSaved={() => setEditingId(null)}
        />
      ) : null}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-navy">All categories</h2>
        <AdminTable
          caption="Categories from the API"
          columns={["Label", "Slug", "Actions"]}
          isEmpty={items.length === 0}
          emptyMessage="No categories yet."
        >
          {items.map((item) => (
            <tr key={item.id}>
              <td className={`${adminTableCellClass} font-medium`}>{item.label}</td>
              <td className={adminTableCellClass}>
                <code className="text-xs text-muted">{item.slug}</code>
              </td>
              <td className={adminTableCellClass}>
                <button
                  type="button"
                  onClick={() => setEditingId(item.id)}
                  className="cursor-pointer text-sm font-semibold text-brand-teal hover:underline"
                  aria-pressed={editingId === item.id}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </section>
  );
}

export function AdminCategoryForm({ view }: AdminCategoryFormProps) {
  if (view === "create") {
    return <AdminCategoryCreateForm />;
  }

  return <AdminCategoryList />;
}
