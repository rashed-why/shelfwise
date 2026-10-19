import { redirect } from "next/navigation";

export default function AdminCategoriesIndexPage() {
  redirect("/admin/categories/list");
}
