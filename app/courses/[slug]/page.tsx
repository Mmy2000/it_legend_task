import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { CoursePlayer } from "@/components/player/CoursePlayer";
import {
  getCourse,
  getCourseExams,
  getCourses,
  getLeaderboard,
  getMotivationTiers,
  getSeedComments,
} from "@/lib/courses";

// Every course page is pre-rendered at build time; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getCourses().map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  return course ? { title: course.title, description: course.summary } : {};
}

export default async function CoursePlayerPage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/" }, { label: "Course Details" }]}
        title={course.title}
      />
      <CoursePlayer
        course={course}
        exams={getCourseExams(course)}
        seedComments={getSeedComments()}
        leaderboard={getLeaderboard()}
        motivationTiers={getMotivationTiers()}
      />
    </main>
  );
}
