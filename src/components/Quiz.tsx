"use client";

import type { Question } from "@/data/quiz";
import type { Answer } from "@/lib/scoring";

interface QuizProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  answers: Answer[];
  onSelect: (questionId: number, score: number, category: string) => void;
  onBack: () => void;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function Quiz({ question, questionIndex, totalQuestions, answers, onSelect, onBack }: QuizProps) {
  const prevAnswer = answers.find((a) => a.questionId === question.id);

  return (
    <div className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-start px-6 pb-20 pt-20">
      <div className="relative z-10 w-full max-w-[680px] animate-[fadeUp_0.4s_ease_both]">
        <div className="mb-6 flex items-center justify-between">
          <span className="border border-amber-500/20 bg-amber-dim px-3 py-1 font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[0.16em] text-amber">
            {question.category}
          </span>
          <span className="font-['Barlow_Condensed'] text-sm font-bold tracking-widest text-grey">
            {pad(questionIndex + 1)} / {totalQuestions}
          </span>
        </div>
        <h2 className="mb-7 font-['Barlow_Condensed'] text-[clamp(26px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.005em] uppercase text-cream">
          {question.text}
        </h2>
        <div className="flex flex-col gap-2.5">
          {question.options.map((opt) => {
            const isSelected = prevAnswer?.score === opt.score;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onSelect(question.id, opt.score, question.category)}
                className={`flex items-start gap-4 border bg-ink-2 p-[18px] pl-[22px] text-left transition-colors ${
                  isSelected
                    ? "border-amber bg-ink-3"
                    : "border-divider hover:border-amber-500/40 hover:bg-ink-3"
                }`}
              >
                <span
                  className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center border font-['Barlow_Condensed'] text-sm font-extrabold transition-colors ${
                    isSelected
                      ? "border-amber bg-amber text-ink"
                      : "border-amber-500/40 text-amber"
                  }`}
                >
                  {opt.label}
                </span>
                <span className={`pt-1 text-base leading-normal ${isSelected ? "text-cream" : "text-grey-light"}`}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
        {questionIndex > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="mt-6 border-none bg-transparent p-0 font-['Barlow_Condensed'] text-sm font-semibold uppercase tracking-[0.08em] text-grey transition-colors hover:text-cream"
          >
            ← Previous question
          </button>
        )}
      </div>
    </div>
  );
}
