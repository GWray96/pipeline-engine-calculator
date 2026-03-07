"use client";

import { useEffect, useState } from "react";
import { CAT_DESCS, type ResultData } from "@/data/quiz";
import type { Scores } from "@/lib/scoring";
import { getBand, barColor } from "@/lib/scoring";
import Link from "next/link";

interface ResultsProps {
  scores: Scores;
  data: ResultData;
  userName: string;
  userEmail: string;
  onRetake: () => void;
}

const CATS = ["Visibility", "System", "Team", "Consistency"] as const;

function AnimatedScore({ target }: { target: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    function frame(now: number) {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(e * target));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }, [target]);

  return <span>{value}</span>;
}

function CategoryBar({ score, delay }: { score: number; delay: number }) {
  const [width, setWidth] = useState(0);
  const color = barColor(score);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 400 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div className="mb-2.5 h-1.5 overflow-hidden bg-ink-3">
      <div
        className="h-full transition-[width] duration-[1.2s] ease-in-out"
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  );
}

export function Results({ scores, data, userName, userEmail, onRetake }: ResultsProps) {
  const band = getBand(scores.overall);

  return (
    <div className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-start px-6 pb-24 pt-20">
      <div className="relative z-10 w-full max-w-[720px] animate-[fadeUp_0.5s_ease_both]">
        <div className="mb-12 text-center" data-user-email={userEmail}>
          <span className="mb-4 block font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[0.18em] text-amber">
            {userName ? `${userName}'s ` : ""}Pipeline Dependency Score
          </span>
          <div className="my-6 flex flex-col items-center gap-5">
            <div
              className="relative flex h-[168px] w-[168px] flex-col items-center justify-center rounded-full border-[3px]"
              style={{
                borderColor: band.color,
                boxShadow: `0 0 40px ${band.color}33`,
              }}
            >
              <div
                className="absolute inset-[-12px] rounded-full"
                style={{
                  background: `radial-gradient(circle, ${band.color}14 0%, transparent 70%)`,
                }}
              />
              <span
                className="font-['Barlow_Condensed'] text-[76px] font-black leading-none tracking-[-0.02em]"
                style={{ color: band.color }}
              >
                <AnimatedScore target={scores.overall} />
              </span>
              <span className="font-['Barlow_Condensed'] text-base font-bold text-grey">/ 100</span>
            </div>
            <div
              className="inline-flex items-center gap-2 rounded border-2 px-5 py-2 font-['Barlow_Condensed'] text-base font-extrabold uppercase tracking-[0.12em]"
              style={{
                borderColor: band.color,
                color: band.color,
                background: `${band.color}18`,
              }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: "currentColor" }} />
              {band.label}
            </div>
          </div>
          <p className="mx-auto max-w-[540px] text-lg leading-[1.6] text-grey-light">{data.summary}</p>
        </div>

        <div className="my-11 h-px bg-divider" />
        <p className="mb-6 font-['Barlow_Condensed'] text-[13px] font-bold uppercase tracking-[0.18em] text-amber">
          Category Breakdown
        </p>
        <div className="mb-11 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {CATS.map((name, i) => {
            const score = scores[name];
            const color = barColor(score);
            return (
              <div key={name} className="border border-divider bg-ink-2 p-5">
                <div className="mb-2.5 flex items-baseline justify-between">
                  <span className="font-['Barlow_Condensed'] text-lg font-extrabold uppercase tracking-[0.05em]" style={{ color }}>
                    {name}
                  </span>
                  <span className="font-['Barlow_Condensed'] text-[28px] font-black leading-none" style={{ color }}>
                    {score}
                    <span className="text-sm font-semibold text-grey">/100</span>
                  </span>
                </div>
                <CategoryBar score={score} delay={i * 80} />
                <p className="text-[13px] leading-normal text-grey">
                  {CAT_DESCS[name]}
                </p>
              </div>
            );
          })}
        </div>

        <div className="my-11 h-px bg-divider" />
        <p className="mb-6 font-['Barlow_Condensed'] text-[13px] font-bold uppercase tracking-[0.18em] text-amber">
          3 Things to Fix First
        </p>
        <p className="mb-6 text-base text-grey-light">Based on your specific breakdown — in priority order.</p>
        <div className="space-y-2.5">
          {data.fixes.map((fix, i) => (
            <div
              key={i}
              className="relative overflow-hidden border border-divider bg-ink-2 p-5 pl-[25px]"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber" />
              <div className="flex gap-4">
                <span className="font-['Barlow_Condensed'] text-[32px] font-black leading-none text-amber">
                  0{i + 1}
                </span>
                <div>
                  <h4 className="mb-1.5 font-['Barlow_Condensed'] text-xl font-extrabold uppercase tracking-[0.04em] text-cream">
                    {fix.title}
                  </h4>
                  <p className="text-[15px] leading-[1.6] text-grey-light">{fix.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-12 overflow-hidden border border-divider bg-ink-2 p-10 text-center">
          <div className="absolute left-0 right-0 top-0 h-0.5 bg-amber" />
          <h3 className="mb-3.5 font-['Barlow_Condensed'] text-[clamp(30px,4vw,46px)] font-black uppercase">
            Ready to Build
            <br />
            the System?
          </h3>
          <p className="mx-auto mb-6 max-w-[480px] text-[17px] leading-[1.6] text-grey-light">
            Pipeline Engine builds done-for-you lead generation systems for recruitment agency owners. 90-day guarantee. No long contracts.
          </p>
          <Link
            href="/#cta"
            className="inline-block border-2 border-amber bg-amber px-9 py-4 font-['Barlow_Condensed'] text-[17px] font-extrabold uppercase tracking-[0.06em] text-ink no-underline transition-all hover:-translate-y-0.5 hover:bg-transparent hover:text-amber"
          >
            Book a Free Discovery Call →
          </Link>
          <p className="mt-3 text-sm text-grey">30 minutes. No obligation. If it&apos;s not the right fit, I&apos;ll tell you.</p>
        </div>

        <div className="mt-7 text-center">
          <button
            type="button"
            onClick={onRetake}
            className="border-none bg-transparent font-['Barlow_Condensed'] text-sm font-semibold uppercase tracking-widest text-grey underline underline-offset-1 transition-colors hover:text-cream"
          >
            ↺ Retake the Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
