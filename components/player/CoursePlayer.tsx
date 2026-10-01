"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ActionBar } from "@/components/player/ActionBar";
import { Comments } from "@/components/player/Comments";
import { CourseMaterials } from "@/components/player/CourseMaterials";
import { CourseTopics } from "@/components/player/CourseTopics";
import { ResourceStage } from "@/components/player/ResourceStage";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { AskQuestionModal } from "@/components/player/modals/AskQuestionModal";
import { ExamModal } from "@/components/player/modals/ExamModal";
import { LeaderboardModal } from "@/components/player/modals/LeaderboardModal";
import { PdfViewerModal } from "@/components/player/modals/PdfViewerModal";
import { flattenLessons, progressPercent } from "@/lib/course-utils";
import { markLessonComplete, setCurrentLesson, useCourseProgress, useExamAttempt } from "@/lib/stores";
import type { Course, CourseComment, Exam, LeaderboardEntry, Lesson, MotivationTier } from "@/types/course";

type ModalName = "pdf" | "exam" | "ask" | "leaderboard" | null;

interface CoursePlayerProps {
  course: Course;
  exams: Record<string, Exam>;
  seedComments: CourseComment[];
  leaderboard: LeaderboardEntry[];
  motivationTiers: MotivationTier[];
}

export function CoursePlayer({
  course,
  exams,
  seedComments,
  leaderboard,
  motivationTiers,
}: CoursePlayerProps) {
  const { slug, seed } = course;
  const lessons = useMemo(() => flattenLessons(course), [course]);
  const progress = useCourseProgress(slug, seed);
  const completed = useMemo(() => new Set(progress.completed), [progress.completed]);

  const currentIndex = Math.max(
    0,
    lessons.findIndex((l) => l.id === progress.currentLessonId),
  );
  const current = lessons[currentIndex];
  const next = lessons[currentIndex + 1];
  const percent = progressPercent(completed.size, lessons.length);
  const examCount = lessons.filter((l) => l.type === "exam").length;

  const [autoPlay, setAutoPlay] = useState(false);
  const [wide, setWide] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const examKey = `${slug}:${current.id}`;
  const savedExam = useExamAttempt(examKey);

  // Expose the (sticky, on mobile) player height so in-page jumps land below it.
  useEffect(() => {
    const stage = stageRef.current;
    const root = rootRef.current;
    if (!stage || !root || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      root.style.setProperty("--player-h", `${Math.round(entry.borderBoxSize[0].blockSize)}px`);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(slug, seed, lesson.id);
    if (lesson.type === "video") {
      setAutoPlay(true);
      // on desktop the player isn't sticky: bring it back into view
      const rect = stageRef.current?.getBoundingClientRect();
      if (rect && rect.bottom < 80) stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (lesson.type === "pdf") {
      markLessonComplete(slug, seed, lesson.id);
      setModal("pdf");
    } else {
      setModal("exam");
    }
  };

  const jumpTo = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    section.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  };

  return (
    <div
      ref={rootRef}
      className={`container-page grid grid-cols-1 pb-16 lg:grid-cols-[minmax(0,748fr)_minmax(0,405fr)] lg:grid-rows-[auto_auto_auto_auto_1fr] lg:gap-x-[clamp(32px,5.5vw,71px)] lg:pb-[90px]`}
    >
      {/* Player — sticky on mobile/tablet, like the YouTube app */}
      <div
        ref={stageRef}
        className={`sticky top-0 z-30 -mx-[15px] bg-white px-[15px] pt-[17px] pb-2 md:-mx-7 md:px-7 lg:static lg:col-start-1 lg:row-start-1 lg:mx-0 lg:px-0 lg:pt-[18px] lg:pb-0 ${
          wide ? "lg:col-span-2" : ""
        }`}
      >
        <div
          className={`aspect-[748/499] overflow-hidden rounded-[6px] bg-black md:max-lg:aspect-video ${
            wide ? "lg:aspect-video" : ""
          }`}
        >
          {current.type === "video" ? (
            <VideoPlayer
              key={current.id}
              lesson={current}
              poster={course.poster}
              autoPlay={autoPlay}
              wide={wide}
              onToggleWide={() => setWide((w) => !w)}
              onComplete={() => markLessonComplete(slug, seed, current.id)}
              onNext={next ? () => selectLesson(next) : undefined}
              nextTitle={next?.title}
            />
          ) : (
            <ResourceStage
              lesson={current}
              poster={course.poster}
              hasSavedAttempt={!!savedExam && savedExam.score === undefined}
              onOpen={() => setModal(current.type === "pdf" ? "pdf" : "exam")}
            />
          )}
        </div>
      </div>

      <ActionBar
        lesson={current}
        lessonNumber={currentIndex + 1}
        totalLessons={lessons.length}
        isCompleted={completed.has(current.id)}
        onCurriculum={() => jumpTo("curriculum")}
        onComments={() => jumpTo("comments")}
        onAsk={() => setModal("ask")}
        onLeaderboard={() => setModal("leaderboard")}
        className="mt-1 lg:col-start-1 lg:row-start-2 lg:mt-9"
      />

      <CourseMaterials
        course={course}
        lessonCount={lessons.length}
        examCount={examCount}
        className="mt-7 lg:col-start-1 lg:row-start-3 lg:mt-[59px]"
      />

      <CourseTopics
        sections={course.sections}
        currentLessonId={current.id}
        completed={completed}
        percent={percent}
        totalLessons={lessons.length}
        onSelect={selectLesson}
        className={`mt-[50px] scroll-mt-[calc(var(--player-h,0px)+16px)] lg:col-start-2 lg:mt-0 lg:scroll-mt-6 ${
          wide ? "lg:row-span-4 lg:row-start-2 lg:pt-10" : "lg:row-span-5 lg:row-start-1 lg:pt-[23px]"
        }`}
      />

      <Comments
        slug={slug}
        seedComments={seedComments}
        className="mt-[50px] scroll-mt-[calc(var(--player-h,0px)+16px)] lg:col-start-1 lg:row-start-4 lg:mt-[60px] lg:scroll-mt-6"
      />

      <PdfViewerModal
        lesson={current.type === "pdf" ? current : undefined}
        open={modal === "pdf"}
        onClose={() => setModal(null)}
      />
      <ExamModal
        exam={current.type === "exam" ? exams[current.src] : undefined}
        storageKey={examKey}
        open={modal === "exam"}
        onClose={() => setModal(null)}
        onPassed={() => markLessonComplete(slug, seed, current.id)}
      />
      <AskQuestionModal
        slug={slug}
        lessonTitle={current.title}
        open={modal === "ask"}
        onClose={() => setModal(null)}
      />
      <LeaderboardModal
        courseTitle={course.title}
        completedLessons={completed.size}
        entries={leaderboard}
        tiers={motivationTiers}
        open={modal === "leaderboard"}
        onClose={() => setModal(null)}
      />
    </div>
  );
}
