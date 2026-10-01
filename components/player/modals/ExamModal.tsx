"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { AlarmIcon, ChevronLeft } from "@/components/ui/icons";
import { formatClock } from "@/lib/course-utils";
import { saveExamAttempt, useExamAttempt, type ExamAttempt } from "@/lib/stores";
import type { Exam } from "@/types/course";

interface ExamModalProps {
  exam?: Exam;
  /** Unique per course + lesson so each exam lesson keeps its own attempt. */
  storageKey: string;
  open: boolean;
  onClose: () => void;
  onPassed: () => void;
}

/**
 * Full-screen exam popup. Answers, the current question and the remaining time
 * are saved on every change, so closing (or reloading) resumes the attempt.
 */
export function ExamModal({ exam, storageKey, open, onClose, onPassed }: ExamModalProps) {
  return (
    <Modal
      open={open && !!exam}
      onClose={onClose}
      title={exam?.title ?? "Exam"}
      hideTitle
      variant="fullscreen"
      className="bg-gradient-to-b from-exam-deep to-exam"
    >
      {exam && (
        <ExamBody
          key={storageKey}
          exam={exam}
          storageKey={storageKey}
          onClose={onClose}
          onPassed={onPassed}
        />
      )}
    </Modal>
  );
}

function freshAttempt(exam: Exam): ExamAttempt {
  return { answers: exam.questions.map(() => null), index: 0, remaining: exam.timeLimit };
}

function grade(exam: Exam, attempt: ExamAttempt): ExamAttempt {
  const correct = exam.questions.filter((q, i) => attempt.answers[i] === q.answer).length;
  return { ...attempt, score: Math.round((correct / exam.questions.length) * 100) };
}

function ExamBody({
  exam,
  storageKey,
  onClose,
  onPassed,
}: {
  exam: Exam;
  storageKey: string;
  onClose: () => void;
  onPassed: () => void;
}) {
  const saved = useExamAttempt(storageKey);
  const [attempt, setAttempt] = useState<ExamAttempt>(() => saved ?? freshAttempt(exam));
  const submitted = attempt.score !== undefined;
  const notifyPassed = useEffectEvent(() => onPassed());

  // persist every change (answer, navigation, timer tick)
  useEffect(() => {
    saveExamAttempt(storageKey, attempt);
  }, [storageKey, attempt]);

  // countdown; auto-submit at zero
  useEffect(() => {
    if (submitted) return;
    const id = window.setInterval(() => {
      setAttempt((a) =>
        a.remaining <= 1 ? grade(exam, { ...a, remaining: 0 }) : { ...a, remaining: a.remaining - 1 },
      );
    }, 1000);
    return () => window.clearInterval(id);
  }, [submitted, exam]);

  useEffect(() => {
    if (attempt.score !== undefined && attempt.score >= exam.passMark) notifyPassed();
  }, [attempt.score, exam.passMark]);

  const question = exam.questions[attempt.index];
  const isLast = attempt.index === exam.questions.length - 1;
  const answeredCount = attempt.answers.filter((a) => a !== null).length;

  const goTo = (index: number) => setAttempt((a) => ({ ...a, index }));
  const choose = (option: number) =>
    setAttempt((a) => ({ ...a, answers: a.answers.map((v, i) => (i === a.index ? option : v)) }));

  return (
    <div className="mx-auto flex h-full w-full max-w-[520px] flex-col px-4 pt-3 pb-4 text-white sm:px-6 sm:pt-5">
      {/* header: back + timer */}
      <div className="relative flex h-12 items-center justify-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close exam (your progress is saved)"
          className="absolute left-0 grid size-11 place-items-center rounded-full hover:bg-white/10"
        >
          <ChevronLeft size={26} strokeWidth={2} />
        </button>
        <h2 className="sr-only">{exam.title}</h2>
        {!submitted && (
          <p
            role="timer"
            aria-label={`Time left ${formatClock(attempt.remaining)}`}
            className={`flex h-9 items-center gap-2 rounded-md px-4 pt-0.5 text-base font-semibold tabular-nums shadow-[0_0_14px_rgb(251_213_0/0.45)] ${
              attempt.remaining <= 60 ? "bg-secondary text-white" : "bg-timer text-indigo"
            }`}
          >
            <AlarmIcon size={20} strokeWidth={2} className="-mt-0.5" />
            {formatClock(attempt.remaining).replace(":", " :")}
          </p>
        )}
      </div>

      {submitted ? (
        <ExamResult
          exam={exam}
          attempt={attempt}
          onRetake={() => setAttempt(freshAttempt(exam))}
          onClose={onClose}
        />
      ) : (
        <>
          {/* question navigator */}
          <nav aria-label="Questions" className="mt-5 scrollbar-thin overflow-x-auto">
            <ol className="mx-auto flex w-max gap-[11px] px-1 py-1">
              {exam.questions.map((q, i) => {
                const active = i === attempt.index;
                const answered = attempt.answers[i] !== null;
                return (
                  <li key={q.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={active ? "step" : undefined}
                      aria-label={`Question ${i + 1}${answered ? ", answered" : ""}`}
                      className={`grid size-11 place-items-center rounded-full border-[1.5px] pt-0.5 text-[17px] font-medium transition sm:size-[46px] ${
                        active
                          ? "border-white bg-white text-exam"
                          : answered
                            ? "border-white bg-white/25"
                            : "border-white/80 hover:bg-white/10"
                      }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* question card */}
          <div className="mt-[30px] flex min-h-0 shrink flex-col overflow-y-auto rounded-[18px] bg-white px-5 pt-7 pb-6 text-[#2d2d2d] sm:px-6">
            <fieldset key={question.id}>
              <legend className="font-body">
                <span className="block text-base font-semibold">{attempt.index + 1}.</span>
                <span className="mt-2 block text-[15px] leading-[1.75] font-semibold">{question.prompt}</span>
              </legend>
              <div className="mt-5 flex flex-col gap-[14px]">
                {question.options.map((option, i) => (
                  <label
                    key={option}
                    className="flex min-h-[54px] cursor-pointer items-stretch overflow-hidden rounded-md bg-white font-body text-sm shadow-[0_2px_10px_rgb(30_40_90/0.14)] transition has-checked:bg-exam-selected has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-white"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={attempt.answers[attempt.index] === i}
                      onChange={() => choose(i)}
                      className="peer sr-only"
                    />
                    <span className="grid w-[50px] shrink-0 place-items-center border-r border-black/10 peer-checked:border-white/30">
                      <span className="grid size-4 place-items-center rounded-[3px] border-[1.5px] border-exam-selected peer-checked:border-white [label:has(:checked)_&]:border-white">
                        <span className="hidden size-1.5 rounded-full bg-white [label:has(:checked)_&]:block" />
                      </span>
                    </span>
                    <span className="flex items-center px-4 py-2 font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {/* footer navigation */}
          <div className="mt-auto flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => goTo(attempt.index - 1)}
              disabled={attempt.index === 0}
              className="min-h-12 flex-1 rounded-md border border-white/70 pt-0.5 font-semibold transition hover:bg-white/10 disabled:opacity-40"
            >
              Previous
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={() => setAttempt((a) => grade(exam, a))}
                className="min-h-12 flex-1 rounded-md bg-timer pt-0.5 font-semibold text-indigo transition hover:brightness-105"
              >
                Submit ({answeredCount}/{exam.questions.length})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goTo(attempt.index + 1)}
                className="min-h-12 flex-1 rounded-md bg-white pt-0.5 font-semibold text-exam transition hover:bg-white/90"
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ExamResult({
  exam,
  attempt,
  onRetake,
  onClose,
}: {
  exam: Exam;
  attempt: ExamAttempt;
  onRetake: () => void;
  onClose: () => void;
}) {
  const score = attempt.score ?? 0;
  const passed = score >= exam.passMark;
  return (
    <div
      role="status"
      className="mt-8 flex flex-1 flex-col items-center rounded-[18px] bg-white px-6 py-10 text-center text-[#2d2d2d]"
    >
      <p className="text-5xl" aria-hidden="true">
        {passed ? "🎉" : "💪"}
      </p>
      <p className="mt-4 text-2xl font-semibold text-heading">{passed ? "You passed!" : "Not quite yet"}</p>
      <p className="mt-2 font-body text-sm">
        Your score: <strong className="text-heading">{score}%</strong> (pass mark {exam.passMark}%)
      </p>
      <ul className="mt-6 w-full space-y-2 text-left font-body text-sm">
        {exam.questions.map((q, i) => {
          const right = attempt.answers[i] === q.answer;
          return (
            <li key={q.id} className="flex gap-2 rounded-md bg-soft px-3 py-2">
              <span aria-hidden="true">{right ? "✅" : "❌"}</span>
              <span>
                <span className="sr-only">{right ? "Correct: " : "Incorrect: "}</span>
                {q.prompt}
                {!right && <span className="block text-xs text-label">Answer: {q.options[q.answer]}</span>}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto flex w-full gap-3 pt-8">
        <button
          type="button"
          onClick={onRetake}
          className="min-h-12 flex-1 rounded-md border border-exam pt-0.5 font-semibold text-exam hover:bg-[#eef0fa]"
        >
          Retake
        </button>
        <button
          type="button"
          onClick={onClose}
          className="min-h-12 flex-1 rounded-md bg-exam pt-0.5 font-semibold text-white hover:bg-exam-deep"
        >
          Back to course
        </button>
      </div>
    </div>
  );
}
