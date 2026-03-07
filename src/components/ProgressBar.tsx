"use client";

interface ProgressBarProps {
  percent: number;
}

export function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div
      className="fixed left-0 right-0 top-[72px] z-99 h-[3px] bg-ink-3"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-amber shadow-[0_0_12px_rgba(232,160,32,0.4)] transition-[width] duration-500 ease-in-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
