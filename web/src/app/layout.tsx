import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Selfwise",
  description:
    "Selfwise helps you understand yourself and grow with intention.",
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
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
