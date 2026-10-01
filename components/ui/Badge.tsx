import type { ReactNode } from "react";

const tones = {
  teal: "bg-primary-soft text-primary-strong",
  red: "bg-secondary-soft text-secondary-strong",
  gray: "bg-soft text-label",
  navy: "bg-[#eef0fa] text-navy",
} as const;

export function Badge({
  tone = "teal",
  children,
  className = "",
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex h-[26px] items-center rounded-[3px] px-1.5 pt-[3px] text-xs leading-none font-medium whitespace-nowrap uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
