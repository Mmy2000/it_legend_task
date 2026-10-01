"use client";

import { useState } from "react";
import { CommentForm } from "@/components/player/Comments";
import { Modal } from "@/components/ui/Modal";
import { CheckCircle } from "@/components/ui/icons";
import { setQuestionDraft, useQuestionDraft } from "@/lib/stores";

/**
 * "Ask a question" popup. Same look as the comment box; the draft is kept in
 * sessionStorage so closing the popup by mistake doesn't lose what was typed.
 */
export function AskQuestionModal({
  slug,
  lessonTitle,
  open,
  onClose,
}: {
  slug: string;
  lessonTitle?: string;
  open: boolean;
  onClose: () => void;
}) {
  const draft = useQuestionDraft(slug);
  const [sent, setSent] = useState(false);

  const close = () => {
    setSent(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={close} title="Ask a question">
      <div className="overflow-y-auto px-5 pt-5 pb-6 sm:px-6">
        {sent ? (
          <div role="status" className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle size={44} className="text-primary-strong" />
            <p className="text-xl font-semibold text-heading">Question sent!</p>
            <p className="font-body text-sm leading-6">The instructor will reply in the comments soon.</p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-2 min-h-11 rounded-[5px] px-4 font-medium text-primary-strong hover:bg-primary-soft"
            >
              Ask another question
            </button>
          </div>
        ) : (
          <>
            {lessonTitle && (
              <p className="font-body text-sm leading-6">
                About: <span className="font-medium text-ink">{lessonTitle}</span>
              </p>
            )}
            <CommentForm
              value={draft}
              onChange={(value) => setQuestionDraft(slug, value)}
              onSubmit={() => setSent(true)}
              placeholder="Write your question"
              label="Your question"
              submitLabel="Send Question"
              className="mt-4"
            />
            {draft && (
              <p className="mt-3 text-xs text-body">Draft saved — you can close this and come back later.</p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
