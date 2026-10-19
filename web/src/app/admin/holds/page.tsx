import { redirect } from "next/navigation";

export default function AdminHoldsIndexPage() {
  redirect("/admin/holds/list");
}
