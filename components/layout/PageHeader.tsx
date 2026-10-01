import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "@/components/ui/icons";

export interface Crumb {
  label: string;
  href?: string;
}

/** Light band with breadcrumb + page title (matches the course page header). */
export function PageHeader({
  crumbs,
  title,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="bg-soft">
      <div className="container-page pt-5 pb-[13px] lg:pt-[14px] lg:pb-[12px]">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-[6px] text-base leading-[26px] text-heading">
            {crumbs.map((crumb, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={crumb.label} className="flex items-center gap-x-[6px]">
                  {crumb.href && !last ? (
                    <Link href={crumb.href} className="transition-colors hover:text-primary-strong">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={last ? "page" : undefined} className={last ? "font-medium" : ""}>
                      {crumb.label}
                    </span>
                  )}
                  {!last && <ChevronRight size={14} strokeWidth={2.4} />}
                </li>
              );
            })}
          </ol>
        </nav>
        <h1 className="mt-1.5 text-[clamp(1.625rem,1.2rem+1.6vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.01em] text-heading lg:mt-[36px] lg:leading-[1.2]">
          {title}
        </h1>
        {children}
      </div>
    </header>
  );
}
