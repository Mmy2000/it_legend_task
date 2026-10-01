import Image from "next/image";
import { initials } from "@/lib/course-utils";

const palette = ["#1ab69d", "#ee4a62", "#485293", "#f8941f", "#8e54e9", "#2f80ed"];

/** Photo avatar with an initials fallback (used for students without a photo). */
export function Avatar({
  name,
  src,
  size,
  className = "",
}: {
  name: string;
  src?: string;
  size: number;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className={`shrink-0 rounded-full bg-soft object-cover ${className}`}
      />
    );
  }
  const color = palette[name.length % palette.length];
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-semibold text-white ${className}`}
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </span>
  );
}
