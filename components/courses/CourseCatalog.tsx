"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { SearchIcon } from "@/components/ui/icons";
import { courseStatus, progressPercent, statusLabel } from "@/lib/course-utils";
import { useAllProgress } from "@/lib/stores";
import type { CourseStatus, CourseSummary } from "@/types/course";

type Filter = "all" | CourseStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All courses" },
  { value: "in-progress", label: statusLabel["in-progress"] },
  { value: "not-started", label: statusLabel["not-started"] },
  { value: "completed", label: statusLabel.completed },
];

export function CourseCatalog({ courses }: { courses: CourseSummary[] }) {
  const progress = useAllProgress();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const items = useMemo(
    () =>
      courses.map((course) => {
        const completed = (progress[course.slug] ?? course.seed).completed.length;
        const percent = progressPercent(completed, course.lessonCount);
        return { course, percent, status: courseStatus(percent) };
      }),
    [courses, progress],
  );

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: items.length, "in-progress": 0, "not-started": 0, completed: 0 };
    items.forEach((i) => c[i.status]++);
    return c;
  }, [items]);

  const visible = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return items.filter(
      ({ course, status }) =>
        (filter === "all" || status === filter) &&
        (!q ||
          course.title.toLowerCase().includes(q) ||
          course.instructor.name.toLowerCase().includes(q) ||
          course.category.toLowerCase().includes(q)),
    );
  }, [items, filter, deferredQuery]);

  return (
    <section aria-labelledby="catalog-heading" className="container-page pt-8 pb-20 lg:pt-12">
      <h2 id="catalog-heading" className="sr-only">
        Course list
      </h2>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter by status"
          className="-mx-[15px] flex scrollbar-thin gap-2 overflow-x-auto px-[15px] pb-1 md:mx-0 md:px-0"
        >
          {filters.map((f) => {
            const active = f.value === filter;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.value)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 pt-0.5 text-[15px] font-medium transition ${
                  active
                    ? "border-primary-strong bg-primary-strong text-white"
                    : "border-line-strong bg-white text-ink hover:border-primary-strong hover:text-primary-strong"
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-2 pt-0.5 pb-px text-xs ${active ? "bg-white/20" : "bg-soft text-label"}`}
                >
                  {counts[f.value]}
                </span>
              </button>
            );
          })}
        </div>

        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Search courses</span>
          <SearchIcon
            size={18}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-body"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses or instructors"
            className="h-12 w-full rounded-full border border-line-strong bg-white pt-0.5 pr-4 pl-11 text-[15px] text-ink placeholder:text-body focus:border-primary-strong focus:outline-none"
          />
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "course" : "courses"} shown
      </p>

      {visible.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-[30px] xl:grid-cols-3">
          {visible.map(({ course, percent, status }, i) => (
            <li key={course.slug}>
              <CourseCard course={course} percent={percent} status={status} eager={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-md border border-dashed border-line-strong px-6 py-14 text-center">
          <p className="text-lg font-medium text-heading">No courses match your filters.</p>
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setQuery("");
            }}
            className="mt-4 min-h-11 rounded-full px-5 font-medium text-primary-strong underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
