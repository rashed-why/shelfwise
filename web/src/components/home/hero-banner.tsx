import Link from "next/link";

const BANNER_IMAGE = "/home/banner/bookstackssmall.jpg";

export function HeroBanner() {
  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      aria-label="Welcome banner"
    >
      <article
        className="relative min-h-[min(520px,85vh)] w-full bg-black bg-cover bg-center"
        style={{ backgroundImage: `url('${BANNER_IMAGE}')` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-brand-teal/55 to-black/25" />

        <div className="relative mx-auto flex min-h-[min(520px,85vh)] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center sm:px-10 lg:px-12">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
            Discover your next great read.
          </h2>
          <div className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg [&_a]:underline [&_a]:underline-offset-4">
            <p>
              Welcome to Shelfwise — browse books by category, place holds, and
              keep track of what you&apos;re reading.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
