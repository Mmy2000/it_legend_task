interface ProgressBarProps {
  value: number;
  label: string;
  className?: string;
  /** Height utility for the track. */
  thickness?: string;
}

/** Simple, static progress bar (used on the course cards). */
export function ProgressBar({ value, label, className = "", thickness = "h-1.5" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={`w-full overflow-hidden rounded-full bg-track ${thickness} ${className}`}
    >
      <div
        className="h-full rounded-full bg-progress transition-[width] duration-700 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
