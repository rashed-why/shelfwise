import Image from "next/image";
import Link from "next/link";
import { categoriesPageHref } from "@/lib/discover-nav";
import { getLogoAsset } from "@/lib/logo";
import { mostViewedViewAllHref } from "@/lib/books";

const exploreLinks = [
  { href: categoriesPageHref, label: "All categories" },
  { href: mostViewedViewAllHref, label: "Most viewed" },
  { href: "/authors", label: "Authors" },
  { href: "/search", label: "Search" },
];

const accountLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Log in" },
  { href: "/register", label: "Create account" },
];

const aboutLinks = [
  { href: "/about", label: "About Selfwise" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help center" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
];

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-navy">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted no-underline transition-colors hover:text-brand-teal"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const logo = getLogoAsset();

  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-12">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={logo.src}
                alt="Selfwise"
                width={logo.width}
                height={logo.height}
                unoptimized
                className="h-9 w-auto max-h-10 object-contain object-left sm:h-10"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Know yourself. Grow with intention. Your friendly library for
              discovery, reading, and personal growth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
            <FooterLinkGroup title="Explore" links={exploreLinks} />
            <FooterLinkGroup title="Account" links={accountLinks} />
            <FooterLinkGroup title="About" links={aboutLinks} />
            <FooterLinkGroup title="Legal" links={legalLinks} />
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted sm:text-left">
          © 2026 Selfwise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
