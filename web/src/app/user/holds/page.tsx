import { MyHoldsPanel } from "@/components/user/my-holds-panel";

export default function DashboardHoldsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">My holds</h1>
      <MyHoldsPanel />
    </div>
  );
}
