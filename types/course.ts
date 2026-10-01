export type LessonType = "video" | "pdf" | "exam";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  /** Duration in minutes (video length, reading time or exam time limit). */
  duration: number;
  /** Video source, PDF file or exam id depending on `type`. */
  src: string;
  /** Number of questions — exam lessons only. */
  questions?: number;
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Instructor {
  name: string;
  title: string;
  avatar: string;
}

export interface Course {
  slug: string;
  title: string;
  summary: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  poster: string;
  instructor: Instructor;
  durationLabel: string;
  enrolled: number;
  language: string;
  certificate: boolean;
  rating: number;
  sections: CourseSection[];
  /** Seeded progress for the demo student (overridden by localStorage once they interact). */
  seed: {
    completed: string[];
    currentLessonId?: string;
  };
}

export interface CourseComment {
  id: string;
  author: string;
  avatar?: string;
  /** ISO date */
  date: string;
  body: string;
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
}

export interface Exam {
  id: string;
  title: string;
  /** Time limit in seconds */
  timeLimit: number;
  passMark: number;
  questions: ExamQuestion[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  avatar?: string;
}

export type CourseStatus = "not-started" | "in-progress" | "completed";

/** Slim course shape sent to the client-side catalog. */
export interface CourseSummary {
  slug: string;
  title: string;
  summary: string;
  category: string;
  level: Course["level"];
  image: string;
  instructor: Pick<Instructor, "name" | "avatar">;
  durationLabel: string;
  lessonCount: number;
  rating: number;
  seed: Course["seed"];
}

export interface MotivationTier {
  /** Show this message when the student is ahead of at least this % of classmates. */
  minPercentile: number;
  emoji: string;
  message: string;
}
