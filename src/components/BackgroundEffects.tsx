"use client";

export function BackgroundEffects() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,160,32,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,160,32,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 30%, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 30%, black 20%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none fixed left-1/2 top-[-200px] z-0 h-[700px] w-[700px] -translate-x-1/2"
        style={{
          background: "radial-gradient(circle, rgba(232,160,32,0.07) 0%, transparent 70%)",
        }}
      />
    </>
  );
}
