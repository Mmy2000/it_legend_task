"use client";

import { CloseButton, Modal } from "@/components/ui/Modal";
import { DownloadIcon, ExternalIcon } from "@/components/ui/icons";
import type { Lesson } from "@/types/course";

/** PDF lessons open in a full-screen popup that can be closed. */
export function PdfViewerModal({
  lesson,
  open,
  onClose,
}: {
  lesson?: Lesson;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open && !!lesson}
      onClose={onClose}
      title={lesson?.title ?? "PDF"}
      hideTitle
      variant="fullscreen"
    >
      {lesson && (
        <>
          <div className="flex items-center gap-2 border-b border-line bg-white px-3 py-2 sm:px-6 sm:py-3">
            <p
              aria-hidden="true"
              className="min-w-0 flex-1 truncate text-base font-semibold text-heading sm:text-xl"
            >
              {lesson.title}
            </p>
            <a
              href={lesson.src}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-11 place-items-center rounded-full text-ink hover:bg-soft sm:flex sm:w-auto sm:gap-2 sm:px-4"
            >
              <ExternalIcon size={19} />
              <span className="sr-only sm:not-sr-only sm:pt-0.5 sm:text-[15px]">Open in new tab</span>
            </a>
            <a
              href={lesson.src}
              download
              className="grid size-11 place-items-center rounded-full text-ink hover:bg-soft sm:flex sm:w-auto sm:gap-2 sm:px-4"
            >
              <DownloadIcon size={19} />
              <span className="sr-only sm:not-sr-only sm:pt-0.5 sm:text-[15px]">Download</span>
            </a>
            <CloseButton onClick={onClose} label="Close PDF" />
          </div>
          <iframe
            src={`${lesson.src}#view=FitH`}
            title={lesson.title}
            className="min-h-0 w-full flex-1 border-0 bg-[#525659]"
          />
        </>
      )}
    </Modal>
  );
}
