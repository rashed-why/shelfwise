import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Shelfwise library dashboard.",
};

export default function UserLayout({ children }: LayoutProps<"/user">) {
  return (
    <main className="w-full flex-1 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full min-w-0 flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-x-8">
          <DashboardSidebar />
          <div className="min-w-0 w-full lg:flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}
