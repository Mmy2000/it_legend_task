"use client";

import { createPersistentStore, useStore } from "@/lib/persistent-store";
import type { CourseComment } from "@/types/course";

/* ---------------------------------- progress --------------------------------- */

export interface CourseProgress {
  completed: string[];
  currentLessonId?: string;
}

const progressStore = createPersistentStore<Record<string, CourseProgress>>("itlegend:progress:v1", {});

/** Stored progress for every course the student has touched. */
export function useAllProgress(): Record<string, CourseProgress> {
  return useStore(progressStore);
}

/** Stored progress for a course, falling back to the seeded mock progress. */
export function useCourseProgress(slug: string, seed: CourseProgress): CourseProgress {
  const all = useStore(progressStore);
  return all[slug] ?? seed;
}

function updateProgress(slug: string, seed: CourseProgress, fn: (p: CourseProgress) => CourseProgress) {
  progressStore.set((all) => ({ ...all, [slug]: fn(all[slug] ?? seed) }));
}

export function setCurrentLesson(slug: string, seed: CourseProgress, lessonId: string) {
  updateProgress(slug, seed, (p) => ({ ...p, currentLessonId: lessonId }));
}

export function markLessonComplete(slug: string, seed: CourseProgress, lessonId: string) {
  updateProgress(slug, seed, (p) =>
    p.completed.includes(lessonId) ? p : { ...p, completed: [...p.completed, lessonId] },
  );
}

/* ---------------------------------- comments --------------------------------- */

const commentsStore = createPersistentStore<Record<string, CourseComment[]>>("itlegend:comments:v1", {});

const NO_COMMENTS: CourseComment[] = [];

export function useAddedComments(slug: string): CourseComment[] {
  return useStore(commentsStore)[slug] ?? NO_COMMENTS;
}

export function addComment(slug: string, comment: CourseComment) {
  commentsStore.set((all) => ({ ...all, [slug]: [...(all[slug] ?? []), comment] }));
}

/* ------------------------------------ exam ----------------------------------- */

export interface ExamAttempt {
  answers: (number | null)[];
  index: number;
  /** Seconds left on the timer when the attempt was last saved. */
  remaining: number;
  score?: number;
}

const examStore = createPersistentStore<Record<string, ExamAttempt>>("itlegend:exams:v1", {});

export function useExamAttempt(key: string): ExamAttempt | undefined {
  return useStore(examStore)[key];
}

export function saveExamAttempt(key: string, attempt: ExamAttempt | undefined) {
  examStore.set((all) => {
    const next = { ...all };
    if (attempt) next[key] = attempt;
    else delete next[key];
    return next;
  });
}

/* ------------------------- "ask a question" draft (session) ------------------------- */

const draftStore = createPersistentStore<Record<string, string>>("itlegend:question-draft", {}, "session");

export function useQuestionDraft(slug: string): string {
  return useStore(draftStore)[slug] ?? "";
}

export function setQuestionDraft(slug: string, value: string) {
  draftStore.set((all) => ({ ...all, [slug]: value }));
}
