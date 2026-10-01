"use client";

import { useId, useState } from "react";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import { LessonRow } from "@/components/player/LessonRow";
import type { CourseSection, Lesson } from "@/types/course";

interface CurriculumSectionProps {
  section: CourseSection;
  /** 1-based number of the first lesson in this section (for screen-reader labels). */
  startIndex: number;
  currentLessonId?: string;
  completed: ReadonlySet<string>;
  defaultOpen: boolean;
  onSelect: (lesson: Lesson) => void;
}

/**
 * One curriculum block. On mobile it is an accordion (as in the mobile
 * reference); from `lg` up every block is expanded and shows its description.
 */
export function CurriculumSection({
  section,
  startIndex,
  currentLessonId,
  completed,
  defaultOpen,
  onSelect,
}: CurriculumSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const doneCount = section.lessons.filter((l) => completed.has(l.id)).length;

  return (
    <div className="border border-line bg-white">
      {/* mobile / tablet: accordion header */}
      <h3 className="lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[80px] w-full items-center justify-between gap-4 px-[30px] py-4 text-left"
        >
          <span className="text-lg leading-[1.3] font-medium text-heading">
            {section.title}
            <span className="sr-only">{`, ${doneCount} of ${section.lessons.length} lessons completed`}</span>
          </span>
          {open ? (
            <MinusIcon size={20} className="text-heading" />
          ) : (
            <PlusIcon size={20} className="text-heading" />
          )}
        </button>
      </h3>

      {/* desktop: static header with description */}
      <div className="hidden px-[22px] pt-[34px] lg:block">
        <h3 className="text-lg leading-[1.3] font-medium text-heading">{section.title}</h3>
        {section.description && (
          <p className="mt-[9px] font-body text-[15px] leading-[25px] text-body">{section.description}</p>
        )}
      </div>

      <div id={panelId} className={`lg:block lg:px-[22px] lg:pt-5 lg:pb-10 ${open ? "" : "max-lg:hidden"}`}>
        <ol>
          {section.lessons.map((lesson, i) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              index={startIndex + i}
              isCurrent={lesson.id === currentLessonId}
              isCompleted={completed.has(lesson.id)}
              onSelect={onSelect}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}
