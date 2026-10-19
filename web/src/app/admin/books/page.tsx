import { redirect } from "next/navigation";

export default function AdminBooksIndexPage() {
  redirect("/admin/books/list");
}
