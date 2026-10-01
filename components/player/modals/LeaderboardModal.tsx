"use client";

import { Avatar } from "@/components/ui/Avatar";
import { CloseButton, Modal } from "@/components/ui/Modal";
import type { LeaderboardEntry, MotivationTier } from "@/types/course";

const POINTS_PER_LESSON = 150;
const toArabicDigits = (n: number) => n.toLocaleString("ar-EG");

/**
 * Leaderboard popup. The student is ranked against mock classmates, and a
 * message (in the instructor's voice) is picked from tiers based on how many
 * students they're ahead of.
 */
export function LeaderboardModal({
  courseTitle,
  completedLessons,
  entries,
  tiers,
  open,
  onClose,
}: {
  courseTitle: string;
  completedLessons: number;
  entries: LeaderboardEntry[];
  tiers: MotivationTier[];
  open: boolean;
  onClose: () => void;
}) {
  const me: LeaderboardEntry = {
    id: "me",
    name: "You",
    points: completedLessons * POINTS_PER_LESSON,
    avatar: "/images/avatars/student-1.webp",
  };
  const ranked = [...entries, me].sort((a, b) => b.points - a.points);
  const myRank = ranked.findIndex((e) => e.id === "me") + 1;
  const behindMe = entries.filter((e) => e.points < me.points).length;
  const percentile = Math.round((behindMe / entries.length) * 100);
  const tier = tiers.find((t) => percentile >= t.minPercentile) ?? tiers[tiers.length - 1];
  const message = tier.message.replace("{percentile}", toArabicDigits(percentile));

  return (
    <Modal open={open} onClose={onClose} title="Leaderboard" hideTitle className="max-w-[440px]!">
      <div className="relative overflow-y-auto px-[22px] pt-[26px] pb-6">
        <CloseButton onClick={onClose} className="absolute top-2 right-2" label="Close leaderboard" />

        <div className="text-center text-indigo">
          <p className="px-8 text-[15px] leading-6">{courseTitle}</p>
          <p className="mt-0.5 text-base font-bold" aria-hidden="true">
            Leaderboard
          </p>
        </div>

        <div
          dir="rtl"
          lang="ar"
          className="mt-[18px] flex items-center gap-3 rounded-lg bg-soft px-4 py-[14px] font-arabic text-indigo"
        >
          <span className="shrink-0 text-[40px] leading-none" aria-hidden="true">
            {tier.emoji}
          </span>
          <p className="text-[13.5px] leading-[1.9] font-medium">{message}</p>
        </div>

        <p className="sr-only">
          You are ranked {myRank} of {ranked.length} with {me.points} points.
        </p>

        <ol className="mt-[30px] flex flex-col gap-[12px] rounded-[20px] bg-soft p-[18px] sm:p-6">
          {ranked.map((entry, i) => {
            const isMe = entry.id === "me";
            return (
              <li
                key={entry.id}
                aria-current={isMe ? "true" : undefined}
                className={`flex min-h-[56px] items-center gap-3 rounded-md border bg-white px-3 py-2 ${
                  isMe ? "border-primary ring-1 ring-primary" : "border-line"
                }`}
              >
                <span
                  className={`w-6 shrink-0 text-center text-sm font-bold ${i < 3 ? "text-[#b7791f]" : "text-label"}`}
                >
                  {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                  {i < 3 && <span className="sr-only">{i + 1}</span>}
                </span>
                <Avatar name={entry.name} src={entry.avatar} size={36} />
                <span
                  className={`min-w-0 flex-1 pt-0.5 text-[15px] leading-tight break-words ${isMe ? "font-semibold text-heading" : "text-ink"}`}
                >
                  {entry.name}
                </span>
                <span className="shrink-0 pt-0.5 text-sm font-medium text-navy">
                  {entry.points.toLocaleString("en-US")} pts
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Modal>
  );
}
