import { redirect } from "next/navigation";

export default function AdminBorrowedIndexPage() {
  redirect("/admin/borrowed/list");
}
