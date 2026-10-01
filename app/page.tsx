import type { Metadata } from "next";
import { CourseCatalog } from "@/components/courses/CourseCatalog";
import { PageHeader } from "@/components/layout/PageHeader";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { countLessons } from "@/lib/course-utils";
import { getCourses } from "@/lib/courses";
import type { CourseSummary } from "@/types/course";

export const metadata: Metadata = {
  title: "My Courses",
};

export default function CoursesPage() {
  // Only the fields the cards need are serialized to the client.
  const courses: CourseSummary[] = getCourses().map((course) => ({
    slug: course.slug,
    title: course.title,
    summary: course.summary,
    category: course.category,
    level: course.level,
    image: course.image,
    instructor: { name: course.instructor.name, avatar: course.instructor.avatar },
    durationLabel: course.durationLabel,
    lessonCount: countLessons(course),
    rating: course.rating,
    seed: course.seed,
  }));

  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHeader crumbs={[{ label: "Home", href: "/" }, { label: "Courses" }]} title="My Courses">
          <p className="mt-2 mb-3 max-w-2xl font-body text-[15px] leading-7 text-muted lg:mb-[22px]">
            Pick up where you left off, or start something new. Your progress is saved on this device.
          </p>
        </PageHeader>
        <CourseCatalog courses={courses} />
      </main>
    </>
  );
}
