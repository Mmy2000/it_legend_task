import { Badge } from "@/components/ui/Badge";
import { CheckCircle, FileIcon, LockIcon } from "@/components/ui/icons";
import { pluralize } from "@/lib/course-utils";
import type { Lesson } from "@/types/course";

interface LessonRowProps {
  lesson: Lesson;
  index: number;
  isCurrent: boolean;
  isCompleted: boolean;
  onSelect: (lesson: Lesson) => void;
}

const typeLabel = { video: "Video", pdf: "PDF", exam: "Exam" } as const;

export function LessonRow({ lesson, index, isCurrent, isCompleted, onSelect }: LessonRowProps) {
  const isExam = lesson.type === "exam";
  // long titles push the exam badges onto two lines, like the reference
  const stackBadges = lesson.title.length > 16;

  return (
    <li className="border-t border-line lg:last:border-b">
      <button
        type="button"
        onClick={() => onSelect(lesson)}
        aria-current={isCurrent ? "true" : undefined}
        className={`group flex min-h-[55px] w-full items-center gap-3 px-[30px] py-[14px] text-left transition-colors lg:-mx-2 lg:w-[calc(100%+16px)] lg:rounded lg:px-2 ${
          isCurrent ? "bg-primary-soft" : "hover:bg-soft"
        }`}
      >
        <span className="flex min-w-0 flex-1 items-start gap-[7px]">
          <FileIcon
            size={15}
            className={`mt-[4px] shrink-0 ${isCurrent ? "text-primary-strong" : "text-[#555]"}`}
          />
          <span
            className={`font-body text-sm leading-[26px] ${
              isCurrent ? "font-medium text-primary-strong" : "text-[#555] group-hover:text-heading"
            }`}
          >
            <span className="sr-only">{`Lesson ${index}, ${typeLabel[lesson.type]}: `}</span>
            {lesson.title}
          </span>
        </span>

        {isExam && (
          <span
            className={`flex shrink-0 gap-1.5 ${stackBadges ? "flex-col items-end" : "flex-wrap justify-end"}`}
          >
            <Badge tone="teal">{pluralize(lesson.questions ?? 0, "Question")}</Badge>
            <Badge tone="red">{lesson.duration} Minutes</Badge>
            {isCompleted && <span className="sr-only">(completed)</span>}
          </span>
        )}

        {!isExam && <StatusIcon isCurrent={isCurrent} isCompleted={isCompleted} />}
      </button>
    </li>
  );
}

function StatusIcon({ isCurrent, isCompleted }: { isCurrent: boolean; isCompleted: boolean }) {
  if (isCompleted) {
    return (
      <span className="shrink-0 text-primary-strong">
        <CheckCircle size={18} />
        <span className="sr-only">(completed)</span>
      </span>
    );
  }
  if (isCurrent) {
    return (
      <span className="flex h-4 w-[18px] shrink-0 items-end justify-center gap-[2px]" aria-hidden="true">
        {[0, 1, 2].map((bar) => (
          <span
            key={bar}
            className="w-[3px] animate-[eq_1s_ease-in-out_infinite] rounded-sm bg-primary-strong"
            style={{ animationDelay: `${bar * 0.18}s`, height: "60%" }}
          />
        ))}
      </span>
    );
  }
  return (
    <span className="shrink-0 text-[#555]">
      <LockIcon size={17} />
      <span className="sr-only">(not completed)</span>
    </span>
  );
}
