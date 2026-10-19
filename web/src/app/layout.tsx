import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shelfwise",
  description:
    "Shelfwise — browse the catalog, place holds, and manage your reading list.",
  icons: {
    icon: [{ url: "/fav.png", type: "image/png" }],
    apple: "/fav.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-foreground">
        <AuthSessionProvider>
          <QueryProvider>
            <ToastProvider />
            <SiteHeader />
            {children}
            <SiteFooter />
          </QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
