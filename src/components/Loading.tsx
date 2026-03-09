"use client";

export function Loading() {
  return (
    <div className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6">
      <div className="relative z-10 animate-[fadeUp_0.4s_ease_both] text-center">
        <div className="mx-auto mb-7 h-20 w-20 rounded-full border-2 border-divider border-t-amber animate-spin" />
        <p className="mb-4 font-['Oswald'] text-[22px] font-bold uppercase tracking-[0.06em] text-grey-light">
          Calculating your score
        </p>
        <div className="mb-4 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="animate-dot-pulse h-1.5 w-1.5 rounded-full bg-amber"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <p className="text-[15px] text-grey">
          Analysing your pipeline dependency across 4 categories...
        </p>
      </div>
    </div>
  );
}
