import Link from "next/link";

export function SiteHeader() {
  return (
    <div className="border-b border-line bg-white">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-heading">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-lg bg-primary-strong text-base text-white"
          >
            IT
          </span>
          <span>
            IT<span className="text-primary-strong">Legend</span>
            <span className="sr-only"> home</span>
          </span>
        </Link>
        <span className="hidden text-sm font-medium text-label sm:block">Welcome back, Student 👋</span>
      </div>
    </div>
  );
}
