import { CourseProgress } from "@/components/player/CourseProgress";
import { CurriculumSection } from "@/components/player/CurriculumSection";
import type { CourseSection, Lesson } from "@/types/course";

interface CourseTopicsProps {
  sections: CourseSection[];
  currentLessonId?: string;
  completed: ReadonlySet<string>;
  percent: number;
  totalLessons: number;
  onSelect: (lesson: Lesson) => void;
  className?: string;
}

export function CourseTopics({
  sections,
  currentLessonId,
  completed,
  percent,
  totalLessons,
  onSelect,
  className = "",
}: CourseTopicsProps) {
  // 1-based number of each section's first lesson
  const startIndexes = sections.map(
    (_, i) => 1 + sections.slice(0, i).reduce((sum, s) => sum + s.lessons.length, 0),
  );
  return (
    <section id="curriculum" aria-labelledby="curriculum-heading" className={className}>
      <h2
        id="curriculum-heading"
        tabIndex={-1}
        className="text-xl leading-[1.3] font-semibold text-heading outline-none"
      >
        Topics for This Course
      </h2>

      <CourseProgress percent={percent} completed={completed.size} total={totalLessons} />

      <div className="flex flex-col gap-[30px] lg:gap-[50px]">
        {sections.map((section, i) => (
          <CurriculumSection
            key={section.id}
            section={section}
            startIndex={startIndexes[i]}
            currentLessonId={currentLessonId}
            completed={completed}
            defaultOpen={section.lessons.some((l) => l.id === currentLessonId)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
