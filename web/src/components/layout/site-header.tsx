import Image from "next/image";
import Link from "next/link";
import { DiscoverMenu } from "@/components/discover/discover-menu";
import { SiteHeaderAuthButton } from "@/components/layout/site-header-auth-button";
import { SiteHeaderSearch } from "@/components/layout/site-header-search";
import { getLogoAsset } from "@/lib/logo";

export function SiteHeader() {
  const logo = getLogoAsset();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white [--site-header-height:6.75rem] sm:[--site-header-height:4.25rem]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6 md:gap-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:contents sm:gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src={logo.src}
              alt="Shelfwise"
              width={logo.width}
              height={logo.height}
              priority
              unoptimized
              sizes="(max-width: 640px) 120px, 180px"
              className="h-8 w-auto max-h-10 object-contain object-left sm:h-11 sm:max-h-12"
            />
          </Link>

          <DiscoverMenu />

          <SiteHeaderAuthButton />
        </div>

        <SiteHeaderSearch />
      </div>
    </header>
  );
}
