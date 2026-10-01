import coursesData from "@/data/courses.json";
import examsData from "@/data/exams.json";
import commentsData from "@/data/comments.json";
import leaderboardData from "@/data/leaderboard.json";
import motivationData from "@/data/motivation.json";
import type { Course, CourseComment, Exam, LeaderboardEntry, MotivationTier } from "@/types/course";

/*
 * Data access layer. Everything here runs on the server: pages read the JSON
 * and pass only what each client component needs, so the mock data never
 * ends up in the JS bundle as a whole.
 */

const courses = coursesData as Course[];
const exams = examsData as Exam[];

export function getCourses(): Course[] {
  return courses;
}

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

/** Exams referenced by a course's exam lessons, keyed by exam id. */
export function getCourseExams(course: Course): Record<string, Exam> {
  const ids = new Set(
    course.sections.flatMap((section) => section.lessons.filter((l) => l.type === "exam").map((l) => l.src)),
  );
  return Object.fromEntries(exams.filter((exam) => ids.has(exam.id)).map((exam) => [exam.id, exam]));
}

export function getSeedComments(): CourseComment[] {
  return commentsData as CourseComment[];
}

export function getLeaderboard(): LeaderboardEntry[] {
  return leaderboardData as LeaderboardEntry[];
}

export function getMotivationTiers(): MotivationTier[] {
  return motivationData as MotivationTier[];
}
