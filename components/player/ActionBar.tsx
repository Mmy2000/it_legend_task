import type { ComponentType, SVGProps } from "react";
import { ChatIcon, CheckCircle, ListIcon, QuestionIcon, TrophyIcon } from "@/components/ui/icons";
import type { Lesson } from "@/types/course";

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

interface ActionBarProps {
  lesson?: Lesson;
  lessonNumber: number;
  totalLessons: number;
  isCompleted: boolean;
  onCurriculum: () => void;
  onComments: () => void;
  onAsk: () => void;
  onLeaderboard: () => void;
  className?: string;
}

/**
 * Row under the player. The reference shows social icons here; per the notes
 * they are replaced with shortcuts to Curriculum, Comments, Ask a question and
 * Leaderboard. The right half shows the current lesson's details.
 */
export function ActionBar({
  lesson,
  lessonNumber,
  totalLessons,
  isCompleted,
  onCurriculum,
  onComments,
  onAsk,
  onLeaderboard,
  className = "",
}: ActionBarProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <ul
        className="flex shrink-0 items-center gap-[17px] sm:w-1/2 sm:max-w-[374px]"
        aria-label="Course shortcuts"
      >
        <ActionButton icon={ListIcon} label="Curriculum" onClick={onCurriculum} />
        <ActionButton icon={ChatIcon} label="Comments" onClick={onComments} />
        <ActionButton icon={QuestionIcon} label="Ask a question" onClick={onAsk} haspopup />
        <ActionButton icon={TrophyIcon} label="Leaderboard" onClick={onLeaderboard} haspopup />
      </ul>

      {lesson && (
        <div className="min-w-0 border-l border-line pl-6 max-sm:hidden sm:self-stretch">
          <p className="flex items-center gap-2 text-sm leading-5 text-body">
            Lesson {lessonNumber} of {totalLessons}
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-primary-strong">
                <CheckCircle size={15} /> Completed
              </span>
            )}
          </p>
          <p className="mt-1 line-clamp-2 text-[17px] leading-6 font-medium text-heading">{lesson.title}</p>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  haspopup = false,
}: {
  icon: Icon;
  label: string;
  onClick: () => void;
  haspopup?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-haspopup={haspopup ? "dialog" : undefined}
        title={label}
        className="grid size-11 place-items-center rounded-full border border-line-strong text-[#707070] transition hover:border-primary-strong hover:bg-primary-strong hover:text-white lg:size-10"
      >
        <Icon size={18} strokeWidth={1.8} />
      </button>
    </li>
  );
}
