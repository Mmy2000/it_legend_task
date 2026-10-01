"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/ui/icons";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (it stays available to screen readers). */
  hideTitle?: boolean;
  /** `fullscreen` covers the viewport (PDF / exam), `dialog` is a centered card. */
  variant?: "dialog" | "fullscreen";
  className?: string;
  children: ReactNode;
}

/**
 * Accessible modal built on the native <dialog> element:
 * focus trapping, Esc to close, inert background and top-layer stacking
 * come from the browser instead of extra JS.
 */
export function Modal({
  open,
  onClose,
  title,
  hideTitle = false,
  variant = "dialog",
  className = "",
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const shell =
    variant === "fullscreen"
      ? "m-0 h-dvh max-h-none w-screen max-w-none"
      : "m-auto w-[calc(100%-24px)] max-w-[560px] max-h-[calc(100dvh-24px)] rounded-xl shadow-card";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // click on the backdrop (the dialog element itself) closes it
        if (variant === "dialog" && e.target === e.currentTarget) onClose();
      }}
      className={`${shell} overflow-hidden bg-white p-0 text-body backdrop:backdrop-blur-[2px] ${className}`}
    >
      {open && (
        <div className="flex h-full max-h-[inherit] flex-col">
          <div
            className={
              hideTitle
                ? "sr-only"
                : "flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6"
            }
          >
            <h2 id={titleId} className="text-lg font-semibold text-heading sm:text-xl">
              {title}
            </h2>
            {!hideTitle && <CloseButton onClick={onClose} />}
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

export function CloseButton({
  onClick,
  className = "",
  label = "Close",
}: {
  onClick: () => void;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid size-10 shrink-0 place-items-center rounded-full text-ink transition hover:bg-soft ${className}`}
    >
      <CloseIcon size={22} />
    </button>
  );
}
