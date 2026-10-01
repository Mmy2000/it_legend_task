"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  MaximizeIcon,
  MinimizeIcon,
  MuteIcon,
  NarrowIcon,
  PauseIcon,
  PlayIcon,
  ReplayIcon,
  VolumeIcon,
  WideIcon,
} from "@/components/ui/icons";
import { formatClock } from "@/lib/course-utils";
import type { Lesson } from "@/types/course";

const RATES = [1, 1.25, 1.5, 2];
const HIDE_CONTROLS_AFTER = 2500;

type OrientationWithLock = ScreenOrientation & {
  lock?: (orientation: "landscape") => Promise<void>;
  unlock?: () => void;
};
type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

interface VideoPlayerProps {
  lesson: Lesson;
  poster: string;
  /** Start playing on mount (true when the student picked the lesson). */
  autoPlay: boolean;
  wide: boolean;
  onToggleWide: () => void;
  onComplete: () => void;
  onNext?: () => void;
  nextTitle?: string;
}

export function VideoPlayer({
  lesson,
  poster,
  autoPlay,
  wide,
  onToggleWide,
  onComplete,
  onNext,
  nextTitle,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    setEnded(false);
    video.play().catch(() => {
      /* autoplay blocked: the big play button stays available */
      setStarted(false);
    });
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) play();
    else video.pause();
  }, [play]);

  useEffect(() => {
    if (autoPlay) play();
  }, [autoPlay, play]);

  // keep fullscreen state in sync (Esc, system gestures, etc.)
  useEffect(() => {
    const onChange = () => {
      const active = document.fullscreenElement === containerRef.current;
      setFullscreen(active);
      if (!active) (screen.orientation as OrientationWithLock | undefined)?.unlock?.();
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), HIDE_CONTROLS_AFTER);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    const video = videoRef.current as IOSVideo | null;
    if (!container || !video) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      if (container.requestFullscreen) {
        await container.requestFullscreen({ navigationUI: "hide" });
        // Rotate to landscape on phones even when auto-rotate is off.
        try {
          await (screen.orientation as OrientationWithLock | undefined)?.lock?.("landscape");
        } catch {
          /* not supported (desktop / iPadOS) */
        }
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen(); // iOS Safari: native fullscreen player
      }
    } catch {
      /* fullscreen refused */
    }
  }, []);

  const seekBy = (delta: number) => {
    const video = videoRef.current;
    if (video)
      video.currentTime = Math.min(Math.max(0, video.currentTime + delta), duration || video.duration || 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const cycleRate = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    video.playbackRate = next;
    setRate(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const onControl = target.tagName === "BUTTON" || target.tagName === "INPUT";
    switch (e.key) {
      case " ":
      case "k":
        if (onControl && e.key === " ") return;
        e.preventDefault();
        togglePlay();
        break;
      case "f":
        e.preventDefault();
        void toggleFullscreen();
        break;
      case "m":
        toggleMute();
        break;
      case "ArrowLeft":
      case "ArrowRight":
        if (target.tagName === "INPUT") return;
        e.preventDefault();
        seekBy(e.key === "ArrowLeft" ? -5 : 5);
        break;
      default:
        return;
    }
    revealControls();
  };

  const showChrome = started && !ended && (!playing || controlsVisible);
  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={`Video player: ${lesson.title}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerMove={revealControls}
      onTouchStart={revealControls}
      className={`group/player relative isolate size-full overflow-hidden bg-black text-white outline-offset-4 [&:fullscreen]:rounded-none ${
        playing && !controlsVisible ? "cursor-none" : ""
      }`}
    >
      <video
        ref={videoRef}
        src={lesson.src}
        // nothing is fetched until the student presses play (saves data on mobile)
        preload="none"
        playsInline
        onClick={togglePlay}
        onDoubleClick={() => void toggleFullscreen()}
        onPlay={() => {
          setPlaying(true);
          revealControls();
        }}
        onPause={() => {
          setPlaying(false);
          setControlsVisible(true);
        }}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
          onComplete();
        }}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onError={() => setFailed(true)}
        className="absolute inset-0 size-full object-contain"
      />

      {/* Poster + big play button before the first play */}
      {!started && (
        <div className="absolute inset-0">
          <Image
            src={poster}
            alt=""
            fill
            preload
            sizes="(min-width: 1300px) 748px, (min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <button
            type="button"
            onClick={play}
            aria-label={`Play lesson: ${lesson.title}`}
            className="absolute top-1/2 left-1/2 grid size-[60px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-secondary shadow-lg transition hover:scale-105 lg:size-20"
          >
            <PlayIcon size={26} className="ml-1 lg:size-[30px]" />
          </button>
        </div>
      )}

      {/* Title bar */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent px-4 pt-3 pb-8 transition-opacity duration-300 lg:px-5 lg:pt-4 ${
          showChrome ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="line-clamp-1 text-[15px] font-medium lg:text-lg">{lesson.title}</p>
      </div>

      {buffering && playing && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
          <span className="size-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
        </div>
      )}

      {failed && (
        <div role="alert" className="absolute inset-0 grid place-items-center bg-black/80 p-6 text-center">
          <p>This video could not be loaded. Please check your connection and try again.</p>
        </div>
      )}

      {/* End-of-lesson overlay */}
      {ended && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/75 p-4 text-center">
          <p className="text-lg font-semibold lg:text-2xl">Lesson complete 🎉</p>
          {nextTitle && (
            <p className="line-clamp-1 text-sm text-white/80 lg:text-base">Up next: {nextTitle}</p>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={play}
              className="inline-flex min-h-11 items-center gap-2 rounded-[5px] border border-white/60 px-4 pt-0.5 font-medium hover:bg-white/10"
            >
              <ReplayIcon size={18} /> Replay
            </button>
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex min-h-11 items-center gap-2 rounded-[5px] bg-primary-strong px-5 pt-0.5 font-semibold hover:bg-primary-hover"
              >
                Next lesson <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Control bar */}
      {started && !ended && (
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2 pt-8 pb-1 transition-opacity duration-300 sm:px-4 sm:pb-2 ${
            showChrome ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => {
              const video = videoRef.current;
              if (video) video.currentTime = Number(e.target.value);
            }}
            aria-label="Seek"
            aria-valuetext={`${formatClock(time)} of ${formatClock(duration)}`}
            className="block h-5 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[image:var(--track)] [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[image:var(--track)] [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            style={
              {
                "--track": `linear-gradient(to right, #1ab69d ${progress}%, rgb(255 255 255 / 0.35) ${progress}%)`,
              } as CSSProperties
            }
          />
          <div className="flex items-center gap-0.5 sm:gap-1">
            <ControlButton label={playing ? "Pause" : "Play"} onClick={togglePlay}>
              {playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
            </ControlButton>
            <ControlButton label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
              {muted ? <MuteIcon size={20} /> : <VolumeIcon size={20} />}
            </ControlButton>
            <span className="px-1.5 pt-0.5 text-xs tabular-nums sm:text-sm">
              {formatClock(time)} <span className="text-white/70">/ {formatClock(duration)}</span>
            </span>
            <span className="flex-1" />
            <ControlButton label={`Playback speed ${rate}x`} onClick={cycleRate}>
              <span className="pt-0.5 text-sm font-semibold">{rate}x</span>
            </ControlButton>
            {!fullscreen && (
              <ControlButton
                label={wide ? "Exit wide mode" : "Wide mode"}
                onClick={onToggleWide}
                pressed={wide}
                className="max-lg:hidden"
              >
                {wide ? <NarrowIcon size={20} /> : <WideIcon size={20} />}
              </ControlButton>
            )}
            <ControlButton
              label={fullscreen ? "Exit full screen" : "Maximize (full screen)"}
              onClick={() => void toggleFullscreen()}
            >
              {fullscreen ? <MinimizeIcon size={20} /> : <MaximizeIcon size={20} />}
            </ControlButton>
          </div>
        </div>
      )}
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  pressed,
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`grid size-11 place-items-center rounded-full transition hover:bg-white/15 ${className}`}
    >
      {children}
    </button>
  );
}
