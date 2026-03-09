"use client";

interface IntroProps {
  onStart: () => void;
}

export function Intro({ onStart }: IntroProps) {
  return (
    <div className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 py-12 pb-20 pt-12">
      <div className="relative z-10 w-full max-w-[740px] animate-[fadeUp_0.6s_ease_both] text-center">
        <div className="mb-8 inline-flex items-center gap-2.5 rounded border border-amber-500/25 bg-amber-dim px-4 py-1.5 font-['Oswald'] text-[13px] font-semibold uppercase tracking-[0.08em] text-amber-light">
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-amber" />
          Free 3-Minute Assessment
        </div>
        <h1 className="mb-7 font-['Oswald'] text-[clamp(48px,7vw,82px)] font-black leading-[0.96] tracking-[-0.01em] uppercase">
          How Dependent
          <br />
          Is <span className="italic text-amber">Your Agency</span>
          <br />
          On You?
        </h1>
        <p className="mx-auto mb-8 max-w-[560px] text-[19px] leading-[1.6] text-grey-light">
          Most recruitment agency owners already know the answer. This quiz gives you the number — and tells you exactly where the cracks are.
        </p>
        <div className="mx-auto mb-9 max-w-[560px] border border-divider border-l-[3px] border-l-amber bg-ink-2 px-6 py-4 text-left text-[15px] italic text-grey-light">
          &ldquo;Honest answers only. The more accurate you are, the more useful your breakdown.&rdquo;
        </div>
        <div className="mx-auto mb-9 flex max-w-[560px] border border-divider">
          {[
            { num: "10", label: "Questions" },
            { num: "4", label: "Categories" },
            { num: "3", label: "Things to Fix" },
            { num: "~3", label: "Minutes" },
          ].map(({ num, label }) => (
            <div
              key={label}
              className="flex-1 border-r border-divider px-4 py-5 text-center last:border-r-0"
            >
              <span className="block font-['Oswald'] text-4xl font-black leading-none text-amber">{num}</span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-widest text-grey">{label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onStart}
          className="inline-block border-2 border-amber bg-amber px-9 py-4 font-['Oswald'] text-[17px] font-extrabold uppercase tracking-[0.06em] text-ink transition-all hover:-translate-y-0.5 hover:bg-transparent hover:text-amber"
        >
          Find Out Now →
        </button>
        <p className="mt-3.5 text-sm text-grey">No email required to start. Results at the end.</p>
      </div>
    </div>
  );
}
