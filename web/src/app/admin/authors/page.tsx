import { redirect } from "next/navigation";

export default function AdminAuthorsIndexPage() {
  redirect("/admin/authors/list");
}
