"use client";

import { useId, useState, type FormEvent } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowRight } from "@/components/ui/icons";
import { formatDate } from "@/lib/course-utils";
import { addComment, useAddedComments } from "@/lib/stores";
import type { CourseComment } from "@/types/course";

const MAX_LENGTH = 1000;

export function Comments({
  slug,
  seedComments,
  className = "",
}: {
  slug: string;
  seedComments: CourseComment[];
  className?: string;
}) {
  const added = useAddedComments(slug);
  const comments = [...seedComments, ...added];
  const [status, setStatus] = useState("");

  return (
    <section id="comments" aria-labelledby="comments-heading" className={className}>
      <h2
        id="comments-heading"
        tabIndex={-1}
        className="text-[27px] leading-[1.25] font-medium text-heading outline-none"
      >
        Comments
        <span className="sr-only"> ({comments.length})</span>
      </h2>

      <ol className="mt-[24px] lg:mt-[33px]">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </ol>

      <CommentForm
        onSubmit={(body) => {
          addComment(slug, {
            id: `local-${Date.now()}`,
            author: "You",
            avatar: "/images/avatars/student-1.webp",
            date: new Date().toISOString(),
            body,
          });
          setStatus("Your comment was added to the list.");
        }}
      />
      <p role="status" className="sr-only">
        {status}
      </p>
    </section>
  );
}

function CommentItem({ comment }: { comment: CourseComment }) {
  return (
    <li className="flex gap-5 border-b border-line pt-[31px] pb-[22px] first:pt-0 last:border-b-0 sm:gap-[29px]">
      <Avatar
        name={comment.author}
        src={comment.avatar}
        size={80}
        className="self-start max-sm:size-[60px]!"
      />
      <article className="min-w-0 flex-1 pt-[6px]">
        <h3 className="text-[15px] leading-[26px] font-medium text-muted">{comment.author}</h3>
        <time dateTime={comment.date} className="mt-[5px] block text-[13px] leading-5 text-body">
          {formatDate(comment.date)}
        </time>
        <p className="mt-[14px] font-body text-sm leading-[26px] break-words whitespace-pre-line text-body">
          {comment.body}
        </p>
      </article>
    </li>
  );
}

/** Textarea + submit button; reused by the "Ask a question" popup. */
export function CommentForm({
  onSubmit,
  value,
  onChange,
  placeholder = "Write a comment",
  submitLabel = "Submit Review",
  label = "Write a comment",
  className = "mt-[37px] lg:mt-8",
}: {
  onSubmit: (body: string) => void;
  /** Optional controlled value (used to persist drafts). */
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  submitLabel?: string;
  label?: string;
  className?: string;
}) {
  const fieldId = useId();
  const errorId = useId();
  const [error, setError] = useState(false);
  const [internal, setInternal] = useState("");
  const text = value ?? internal;
  const setText = onChange ?? setInternal;
  const trimmed = text.trim();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!trimmed) {
      setError(true);
      document.getElementById(fieldId)?.focus();
      return;
    }
    setError(false);
    onSubmit(trimmed);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <label className="sr-only" htmlFor={fieldId}>
        {label}
      </label>
      <textarea
        id={fieldId}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) setError(false);
        }}
        aria-invalid={error || undefined}
        aria-describedby={error ? errorId : undefined}
        placeholder={placeholder}
        maxLength={MAX_LENGTH}
        rows={5}
        className="block h-[168px] min-h-[120px] w-full resize-y rounded-[4px] bg-white px-5 pt-[18px] pb-4 text-base leading-6 text-ink shadow-card placeholder:text-[#8a8a8a] focus:outline-2 focus:outline-primary-strong"
      />
      {error && (
        <p id={errorId} className="mt-2 text-sm text-secondary-strong">
          Please write something before submitting.
        </p>
      )}
      <button
        type="submit"
        className="mt-[31px] inline-flex h-[59px] items-center gap-[10px] rounded-[5px] bg-primary-strong px-[28px] pt-0.5 text-base font-semibold text-white transition hover:bg-primary-hover"
      >
        {submitLabel}
        <ArrowRight size={18} strokeWidth={2.2} />
      </button>
    </form>
  );
}
