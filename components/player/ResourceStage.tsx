import Image from "next/image";
import { FileIcon, QuizIcon } from "@/components/ui/icons";
import type { Lesson } from "@/types/course";

/** What the player area shows when the current lesson is a PDF or an exam. */
export function ResourceStage({
  lesson,
  poster,
  onOpen,
  hasSavedAttempt,
}: {
  lesson: Lesson;
  poster: string;
  onOpen: () => void;
  hasSavedAttempt: boolean;
}) {
  const isExam = lesson.type === "exam";
  const Icon = isExam ? QuizIcon : FileIcon;
  const action = isExam ? (hasSavedAttempt ? "Resume exam" : "Start exam") : "Open PDF";

  return (
    <div className="relative isolate size-full overflow-hidden bg-[#0d1b2a] text-white">
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 748px, 100vw"
        className="-z-10 object-cover opacity-30 blur-[2px]"
      />
      <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center sm:gap-4">
        <span className="grid size-14 place-items-center rounded-full bg-white/15 sm:size-16">
          <Icon size={30} />
        </span>
        <p className="text-sm tracking-[0.12em] text-white/80 uppercase">
          {isExam ? "Exam" : "Reading material"}
        </p>
        <p className="line-clamp-2 max-w-md text-lg leading-snug font-semibold sm:text-2xl">{lesson.title}</p>
        {isExam && (
          <p className="text-sm text-white/80">
            {lesson.questions} questions · {lesson.duration} minutes
          </p>
        )}
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="mt-1 inline-flex min-h-11 items-center rounded-[5px] bg-primary-strong px-6 pt-0.5 font-semibold transition hover:bg-primary-hover"
        >
          {action}
        </button>
      </div>
    </div>
  );
}
