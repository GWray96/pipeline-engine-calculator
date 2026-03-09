import Link from "next/link";

export function Nav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-100 flex items-center justify-between border-b border-divider bg-ink/92 px-6 py-[18px] backdrop-blur-xl">
      <Link
        href="/"
        className="font-['Oswald'] text-[22px] font-extrabold tracking-[0.04em] text-cream no-underline"
      >
        Pipeline<span className="text-amber">Engine</span>
      </Link>
      <Link
        href="https://pipeline-engine-lanndingpage.vercel.app/"
        className="font-['Oswald'] text-sm font-semibold uppercase tracking-[0.06em] text-grey no-underline transition-colors hover:text-amber"
      >
        ← Back to site
      </Link>
    </nav>
  );
}
