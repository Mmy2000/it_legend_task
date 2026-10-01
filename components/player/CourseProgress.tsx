"use client";

import { Avatar } from "@/components/ui/Avatar";
import { useInView } from "@/lib/hooks/useInView";

interface CourseProgressProps {
  percent: number;
  completed: number;
  total: number;
}

/**
 * Course progress with the "You" marker. The bar fills from 0 the first time
 * it scrolls into view, as requested in the design notes.
 */
export function CourseProgress({ percent, completed, total }: CourseProgressProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.6 });
  const shown = inView ? percent : 0;
  // keep the bubble fully inside the track at both ends
  const markerLeft = `clamp(16px, ${shown}%, calc(100% - 16px))`;

  return (
    <div ref={ref} className="relative pt-[46px] pb-[34px] lg:pt-[62px] lg:pb-[68px]">
      <div
        role="progressbar"
        aria-label="Course progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}% complete, ${completed} of ${total} lessons`}
        className="relative h-[5px] rounded-full bg-track"
      >
        <div
          className="h-full rounded-full bg-progress transition-[width] duration-[1400ms] ease-out"
          style={{ width: `${shown}%` }}
        />

        {/* "You" bubble + percentage, following the fill */}
        <div
          aria-hidden="true"
          className="absolute top-0 -translate-x-1/2 transition-[left] duration-[1400ms] ease-out"
          style={{ left: markerLeft }}
        >
          <span className="absolute bottom-[13px] left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-full border border-[#c8c8c8] bg-white pt-0.5 text-[10px] font-medium text-navy">
            You
            <span className="absolute -bottom-[5px] left-1/2 size-2 -translate-x-1/2 rotate-45 border-r border-b border-[#c8c8c8] bg-white" />
          </span>
          <span className="absolute top-[15px] left-1/2 -translate-x-1/2 text-[11px] font-medium text-navy">
            {percent}%
          </span>
        </div>

        <Avatar
          name="You"
          src="/images/avatars/student-1.webp"
          size={26}
          className="absolute top-3 left-5 shadow-soft ring-2 ring-white max-lg:hidden"
        />
      </div>
    </div>
  );
}
