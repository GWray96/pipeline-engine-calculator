"use client";

import { useState, useCallback } from "react";
import { Nav } from "./Nav";
import { ProgressBar } from "./ProgressBar";
import { BackgroundEffects } from "./BackgroundEffects";
import { Intro } from "./Intro";
import { Quiz } from "./Quiz";
import { EmailCapture } from "./EmailCapture";
import { Loading } from "./Loading";
import { Results } from "./Results";
import { QUESTIONS } from "@/data/quiz";
import {
  calcScores,
  getBand,
  getFallbackResult,
  type Answer,
  type Scores,
} from "@/lib/scoring";
import { getSupabase } from "@/lib/supabase";
import type { ResultData } from "@/data/quiz";

type Stage = "intro" | "quiz" | "email" | "loading" | "results";

export function QuizApp() {
  const [stage, setStage] = useState<Stage>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [scores, setScores] = useState<Scores | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);

  const showProgressBar = stage === "quiz" || stage === "email";
  const progressPercent =
    stage === "quiz"
      ? Math.round((questionIndex / QUESTIONS.length) * 100)
      : stage === "email"
        ? 100
        : 0;

  const transition = useCallback((fn: () => void) => {
    const app = document.getElementById("quiz-app");
    if (app) {
      app.style.opacity = "0";
      app.style.transform = "translateY(12px)";
    }
    setTimeout(() => {
      fn();
      requestAnimationFrame(() => {
        if (app) {
          app.style.opacity = "1";
          app.style.transform = "translateY(0)";
        }
      });
    }, 260);
  }, []);

  const startQuiz = useCallback(() => {
    transition(() => {
      setQuestionIndex(0);
      setAnswers([]);
      setStage("quiz");
    });
  }, [transition]);

  const handleSelect = useCallback(
    (questionId: number, score: number, category: string) => {
      setAnswers((prev) => {
        const existing = prev.findIndex((a) => a.questionId === questionId);
        const next =
          existing >= 0
            ? prev.map((a) => (a.questionId === questionId ? { questionId, score, category } : a))
            : [...prev, { questionId, score, category }];
        return next;
      });

      setTimeout(() => {
        if (questionIndex + 1 < QUESTIONS.length) {
          transition(() => setQuestionIndex((i) => i + 1));
        } else {
          transition(() => setStage("email"));
        }
      }, 360);
    },
    [questionIndex, transition]
  );

  const handleBack = useCallback(() => {
    transition(() => setQuestionIndex((i) => i - 1));
  }, [transition]);

  const handleEmailSubmit = useCallback(
    async (name: string, email: string) => {
      setUserName(name);
      setUserEmail(email);

      transition(() => setStage("loading"));

      const s = calcScores(answers);
      setScores(s);
      const result = getFallbackResult(s);
      setResultData(result);
      const band = getBand(s.overall);

      // Save to Supabase
      try {
        const db = getSupabase();
        if (db) {
          await db.from("quiz_leads").insert({
          name: name.trim(),
          email: email.trim(),
          answers,
          scores: s,
          band_label: band.label,
          });
        }
      } catch (err) {
        console.error("Failed to save lead:", err);
      }

      setTimeout(() => {
        transition(() => setStage("results"));
      }, 2000);
    },
    [answers, transition]
  );

  const handleRetake = useCallback(() => {
    transition(() => {
      setStage("intro");
      setQuestionIndex(0);
      setAnswers([]);
      setScores(null);
      setResultData(null);
    });
  }, [transition]);

  return (
    <>
      <Nav />
      {showProgressBar && <ProgressBar percent={progressPercent} />}
      <BackgroundEffects />
      <main
        id="quiz-app"
        className="relative z-1 min-h-screen pt-[72px] transition-[opacity,transform] duration-300 ease-out"
      >
        {stage === "intro" && <Intro onStart={startQuiz} />}
        {stage === "quiz" && (
          <Quiz
            question={QUESTIONS[questionIndex]}
            questionIndex={questionIndex}
            totalQuestions={QUESTIONS.length}
            answers={answers}
            onSelect={handleSelect}
            onBack={handleBack}
          />
        )}
        {stage === "email" && <EmailCapture onSubmit={handleEmailSubmit} />}
        {stage === "loading" && <Loading />}
        {stage === "results" && scores && resultData && (
          <Results
            scores={scores}
            data={resultData}
            userName={userName}
            userEmail={userEmail}
            onRetake={handleRetake}
          />
        )}
      </main>
    </>
  );
}
