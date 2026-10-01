import type { ComponentType, SVGProps } from "react";
import {
  BooksIcon,
  CertificateIcon,
  ClockIcon,
  GlobeIcon,
  InstructorIcon,
  LevelIcon,
  QuizIcon,
  StudentIcon,
} from "@/components/ui/icons";
import type { Course } from "@/types/course";

const MOBILE_ITEMS = 5;

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

interface Material {
  label: string;
  value: string;
  icon: Icon;
}

function buildMaterials(course: Course, lessonCount: number, examCount: number): Material[] {
  return [
    { label: "Instructor", value: course.instructor.name, icon: InstructorIcon },
    { label: "Duration", value: course.durationLabel, icon: ClockIcon },
    { label: "Lessons", value: String(lessonCount), icon: BooksIcon },
    { label: "Enrolled", value: `${course.enrolled.toLocaleString("en-US")} students`, icon: StudentIcon },
    { label: "Language", value: course.language, icon: GlobeIcon },
    { label: "Level", value: course.level, icon: LevelIcon },
    { label: "Quizzes", value: String(examCount), icon: QuizIcon },
    { label: "Certificate", value: course.certificate ? "Yes" : "No", icon: CertificateIcon },
  ];
}

/**
 * Desktop: section title above a 2-column card (4 rows per column).
 * Mobile: everything sits inside one card with a smaller title (per the mobile reference).
 */
export function CourseMaterials({
  course,
  lessonCount,
  examCount,
  className = "",
}: {
  course: Course;
  lessonCount: number;
  examCount: number;
  className?: string;
}) {
  const items = buildMaterials(course, lessonCount, examCount);

  return (
    <section
      aria-labelledby="materials-heading"
      className={`bg-white px-[38px] pt-[42px] pb-6 shadow-card lg:bg-transparent lg:p-0 lg:shadow-none ${className}`}
    >
      <h2
        id="materials-heading"
        className="text-base leading-[1.3] font-medium text-heading lg:text-[27px] lg:leading-[1.25]"
      >
        Course Materials
      </h2>

      <dl className="mt-[14px] grid grid-cols-1 md:grid-flow-col md:grid-cols-2 md:grid-rows-4 md:gap-x-[12%] lg:mt-[32px] lg:gap-x-[21%] lg:bg-white lg:px-[38px] lg:py-[21px] lg:shadow-card">
        {items.map(({ label, value, icon: Icon }, i) => (
          <div
            key={label}
            // phones show the first five facts (as in the mobile reference)
            className={`flex min-h-[56px] items-center justify-between gap-4 border-b border-line py-3 last:border-b-0 md:[&:nth-child(4)]:border-b-0 max-md:[&:nth-child(5)]:border-b-0 ${
              i >= MOBILE_ITEMS ? "max-md:hidden" : ""
            }`}
          >
            <dt className="flex items-center gap-[14px] text-base leading-6 text-label">
              <Icon size={22} strokeWidth={1.4} className="shrink-0 text-heading" />
              {label}:
            </dt>
            <dd className="text-right font-body text-[15px] leading-6 text-heading">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
