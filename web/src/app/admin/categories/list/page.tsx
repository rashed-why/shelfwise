import { AdminCategoryForm } from "@/components/admin/admin-category-form";

export default function AdminCategoriesListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Categories</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Categories added in this browser.
      </p>
      <div className="mt-8">
        <AdminCategoryForm view="list" />
      </div>
    </div>
  );
}
