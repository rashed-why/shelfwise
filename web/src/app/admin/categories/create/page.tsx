import { AdminCategoryForm } from "@/components/admin/admin-category-form";

export default function AdminCategoriesCreatePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Categories</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Add a new browse category.
      </p>
      <div className="mt-8">
        <AdminCategoryForm view="create" />
      </div>
    </div>
  );
}
