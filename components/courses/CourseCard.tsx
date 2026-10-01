import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ArrowRight, BooksIcon, ClockIcon, StarIcon } from "@/components/ui/icons";
import { ctaLabel, pluralize, statusLabel } from "@/lib/course-utils";
import type { CourseStatus, CourseSummary } from "@/types/course";

const statusStyles: Record<CourseStatus, string> = {
  "not-started": "bg-soft text-label",
  "in-progress": "bg-[#fff6e5] text-[#8a5300]",
  completed: "bg-primary-soft text-primary-strong",
};

interface CourseCardProps {
  course: CourseSummary;
  percent: number;
  status: CourseStatus;
  /** Load the image eagerly with high priority (first row, likely LCP). */
  eager?: boolean;
}

export function CourseCard({ course, percent, status, eager = false }: CourseCardProps) {
  const href = `/courses/${course.slug}`;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md border border-line bg-white transition duration-300 focus-within:shadow-card hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[8/5] overflow-hidden bg-soft">
        <Image
          src={course.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 390px, (min-width: 768px) 45vw, 100vw"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-[3px] bg-white/95 px-2.5 pt-1.5 pb-1 text-xs font-semibold tracking-wide text-heading uppercase">
          {course.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <ul
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-body"
          aria-label="Course details"
        >
          <li className="flex items-center gap-1.5">
            <BooksIcon size={16} />
            {pluralize(course.lessonCount, "Lesson")}
          </li>
          <li className="flex items-center gap-1.5">
            <ClockIcon size={16} />
            {course.durationLabel}
          </li>
          <li className="flex items-center gap-1 text-[#8a5300]">
            <StarIcon size={14} className="text-[#f8b81f]" />
            <span>
              {course.rating.toFixed(1)}
              <span className="sr-only"> out of 5</span>
            </span>
          </li>
        </ul>

        <h2 className="mt-3 line-clamp-2 text-xl leading-[1.35] font-semibold text-heading">
          {course.title}
        </h2>
        <p className="mt-2 line-clamp-2 font-body text-sm leading-6 text-body">{course.summary}</p>

        <div className="mt-4 flex items-center gap-2.5">
          <Avatar name={course.instructor.name} src={course.instructor.avatar} size={32} />
          <span className="text-[15px] text-label">
            <span className="sr-only">Instructor: </span>
            {course.instructor.name}
          </span>
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between gap-2 text-sm">
            <span className={`rounded-full px-2.5 pt-1 pb-0.5 text-xs font-semibold ${statusStyles[status]}`}>
              {statusLabel[status]}
            </span>
            <span className="font-medium text-ink">{percent}% complete</span>
          </div>
          <ProgressBar value={percent} label={`${course.title} progress`} />

          <Link
            href={href}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[5px] bg-primary-strong px-6 text-base font-semibold text-white transition after:absolute after:inset-0 after:content-[''] hover:bg-primary-hover"
          >
            {ctaLabel[status]}
            <span className="sr-only">course: {course.title}</span>
            <ArrowRight size={18} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </article>
  );
}
