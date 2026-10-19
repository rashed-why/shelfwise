import { MyReadingListPanel } from "@/components/user/my-reading-list-panel";

export default function DashboardReadingListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Reading list</h1>
      <MyReadingListPanel />
    </div>
  );
}
