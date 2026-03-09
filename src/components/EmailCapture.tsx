"use client";

import { useState, useCallback } from "react";

interface EmailCaptureProps {
  onSubmit: (name: string, email: string) => void;
}

const CATS = ["Visibility", "System", "Team", "Consistency"];
const PREVIEW_WIDTHS = [55, 40, 70, 35];

export function EmailCapture({ onSubmit }: EmailCaptureProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = useCallback(() => {
    const nameOk = name.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    setNameError(!nameOk);
    setEmailError(!emailOk);

    if (!nameOk || !emailOk) return;

    onSubmit(name.trim(), email.trim());
  }, [name, email, onSubmit]);

  return (
    <div className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 py-12 pb-20">
      <div className="relative z-10 w-full max-w-[540px] animate-[fadeUp_0.5s_ease_both] text-center">
        <span className="mb-4 block font-head text-xs font-bold uppercase tracking-[0.18em] text-amber">
          Your Score Is Ready
        </span>
        <h2 className="mb-5 font-head text-[clamp(44px,6vw,68px)] font-black leading-[0.96] uppercase">
          One last
          <br />
          thing.
        </h2>
        <p className="mb-7 text-lg leading-[1.6] text-grey-light">
          Enter your details to unlock your full Pipeline Dependency breakdown — score across all 4 categories and 3 things to fix first.
        </p>
        <div className="mb-7 border border-divider border-l-[3px] border-l-amber bg-ink-2 p-6 text-left">
          <span className="mb-2.5 block font-head text-[11px] font-bold uppercase tracking-[0.14em] text-amber">
            Score preview
          </span>
          {CATS.map((cat, i) => (
            <div key={cat} className="mb-2 flex items-center gap-3">
              <span className="w-[90px] shrink-0 text-right text-[13px] font-semibold text-grey">{cat}</span>
              <div className="h-1 flex-1 bg-ink-3">
                <div
                  className="h-full border-r-2 border-amber bg-amber-dim"
                  style={{ width: `${PREVIEW_WIDTHS[i]}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-3 text-left">
          <label htmlFor="nameInput" className="mb-1.5 block font-head text-xs font-bold uppercase tracking-[0.12em] text-grey">
            Full Name
          </label>
          <input
            id="nameInput"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("emailInput")?.focus()}
            placeholder="Your full name"
            autoComplete="name"
            className={`w-full border bg-ink-2 px-[18px] py-3.5 text-[17px] text-cream outline-none transition-colors placeholder:text-grey focus:border-amber-500/50 ${
              nameError ? "border-red" : "border-divider"
            }`}
          />
          {nameError && <p className="mt-1 text-left text-[13px] text-red">Please enter your full name.</p>}
        </div>

        <div className="mb-4 text-left">
          <label htmlFor="emailInput" className="mb-1.5 block font-head text-xs font-bold uppercase tracking-[0.12em] text-grey">
            Email Address
          </label>
          <input
            id="emailInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="your@email.com"
            autoComplete="email"
            className={`w-full border bg-ink-2 px-[18px] py-3.5 text-[17px] text-cream outline-none transition-colors placeholder:text-grey focus:border-amber-500/50 ${
              emailError ? "border-red" : "border-divider"
            }`}
          />
          {emailError && <p className="mt-1 text-left text-[13px] text-red">Please enter a valid email address.</p>}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full border-2 border-amber bg-amber px-9 py-4 font-head text-[17px] font-extrabold uppercase tracking-[0.06em] text-ink transition-all hover:-translate-y-0.5 hover:bg-transparent hover:text-amber"
        >
          Show Me My Score →
        </button>
        <p className="mt-3 text-sm text-grey">No spam. Your results, nothing else.</p>
      </div>
    </div>
  );
}
