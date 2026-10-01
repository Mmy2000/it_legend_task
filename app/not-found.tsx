import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container-page grid min-h-[70dvh] place-items-center py-20 text-center">
      <div>
        <p className="text-sm font-semibold tracking-[0.15em] text-primary-strong uppercase">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-heading sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 font-body text-[15px] leading-7">
          The course may have moved, or the link is incorrect.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center rounded-[5px] bg-primary-strong px-7 pt-0.5 font-semibold text-white hover:bg-primary-hover"
        >
          Back to courses
        </Link>
      </div>
    </main>
  );
}
