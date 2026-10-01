import type { SVGProps } from "react";

/*
 * Inline SVG icon set (stroke icons on a 24px grid). Inlining a handful of
 * icons is lighter than shipping an icon library.
 * Icons are decorative by default (aria-hidden); label the parent control.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ChevronRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);
export const ChevronLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="m15 6-6 6 6 6" />
  </Svg>
);
export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const FileIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </Svg>
);
export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6" y="10.5" width="12" height="10" rx="5" />
    <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
    <circle cx="12" cy="15.5" r="1.2" />
  </Svg>
);
export const CheckCircle = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.7 2.7L16.5 9.5" />
  </Svg>
);
export const PlayIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </Svg>
);
export const PauseIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <rect x="6.5" y="5" width="4" height="14" rx="1" />
    <rect x="13.5" y="5" width="4" height="14" rx="1" />
  </Svg>
);
export const VolumeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  </Svg>
);
export const MuteIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z" />
    <path d="m16 9.5 5 5M21 9.5l-5 5" />
  </Svg>
);
export const MaximizeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </Svg>
);
export const MinimizeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
  </Svg>
);
export const WideIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <path d="m7 10-2 2 2 2M17 10l2 2-2 2" />
  </Svg>
);
export const NarrowIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <path d="m5 10 2 2-2 2M19 10l-2 2 2 2" />
  </Svg>
);
export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
export const BooksIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 4h3v16H4zM8.5 4h3v16h-3z" />
    <path d="m13.5 5.2 2.9-.8 3.9 14.6-2.9.8z" />
    <path d="M4 8h3M8.5 8h3" />
  </Svg>
);
export const StudentIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="7.5" r="3.5" />
    <path d="M5 20.5c.6-4 3.4-6 7-6s6.4 2 7 6z" />
    <path d="M10 14.8 12 18l2-3.2" />
  </Svg>
);
export const GlobeIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  </Svg>
);
export const InstructorIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 21c.8-4 3.8-6 7.5-6s6.7 2 7.5 6zM9.5 3.8 12 2l2.5 1.8" />
  </Svg>
);
export const LevelIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 20v-5M10 20v-9M15 20V7M20 20V4" />
  </Svg>
);
export const CertificateIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <circle cx="15.5" cy="15" r="3" />
    <path d="m14 17.6-.8 3.9 2.3-1.3 2.3 1.3-.8-3.9M7 8h8M7 11h4" />
  </Svg>
);
export const QuizIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="3.5" width="14" height="17" rx="2" />
    <path d="M9 3.5h6v3H9zM8.5 11l1.5 1.5L13 9.5M8.5 16h7" />
  </Svg>
);
export const ListIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <circle cx="4.5" cy="6" r="1" />
    <circle cx="4.5" cy="12" r="1" />
    <circle cx="4.5" cy="18" r="1" />
  </Svg>
);
export const ChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 11.5c0 4.1-3.6 7.5-8 7.5a8.6 8.6 0 0 1-3.5-.7L4 19.5l1.3-3.6A7.2 7.2 0 0 1 4 11.5C4 7.4 7.6 4 12 4s8 3.4 8 7.5Z" />
  </Svg>
);
export const QuestionIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.3a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.2-2.4 3.7" />
    <circle cx="12" cy="17" r=".6" fill="currentColor" />
  </Svg>
);
export const TrophyIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 4h8v6a4 4 0 0 1-8 0zM8 6H4.5v1.5A3.5 3.5 0 0 0 8 11M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11M12 14v3.5M8.5 20.5h7l-.8-3h-5.4z" />
  </Svg>
);
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const MinusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);
export const AlarmIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="13" r="7.5" />
    <path d="M12 9.5V13l2 1.5M4 5.5 7 3M20 5.5 17 3" />
  </Svg>
);
export const DownloadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
  </Svg>
);
export const ExternalIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Svg>
);
export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.4-4.4" />
  </Svg>
);
export const StarIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
  </Svg>
);
export const ReplayIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5M4 4v4.5h4.5" />
  </Svg>
);
