import { AdminCategoryForm } from "@/components/admin/admin-category-form";

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Categories</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Create browse categories for the catalog.
      </p>

      <div className="mt-8">
        <AdminCategoryForm />
      </div>
    </div>
  );
}
