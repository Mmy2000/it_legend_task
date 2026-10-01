import type { Course, CourseStatus, Lesson } from "@/types/course";

/* Pure helpers shared by server and client components. */

export function flattenLessons(course: Pick<Course, "sections">): Lesson[] {
  return course.sections.flatMap((section) => section.lessons);
}

export function countLessons(course: Pick<Course, "sections">): number {
  return course.sections.reduce((sum, s) => sum + s.lessons.length, 0);
}

export function progressPercent(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function courseStatus(percent: number): CourseStatus {
  if (percent >= 100) return "completed";
  if (percent > 0) return "in-progress";
  return "not-started";
}

export const statusLabel: Record<CourseStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
};

export const ctaLabel: Record<CourseStatus, string> = {
  "not-started": "Start",
  "in-progress": "Continue",
  completed: "Review",
};

export function pluralize(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${String(m).padStart(2, "0")}:${sec}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
