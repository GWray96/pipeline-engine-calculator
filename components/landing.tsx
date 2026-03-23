"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  MessageSquare,
  Calendar,
  Shield,
  Clock,
  BarChart2,
} from "lucide-react";

// ─── FAQ accordion ────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-sm font-medium text-text-primary">{q}</span>
        <ChevronDown
          size={16}
          className={`text-text-muted flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-text-muted leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Results mockup ───────────────────────────────────────────────────────────

function ResultsMockup() {
  const needed = 8;
  const current = 2;
  const gap = 6;
  const neededPct = 67;
  const currentPct = 17;

  return (
    <div className="relative">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-elevated border border-border text-xs text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-amber" />
          Example result — yours will differ
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-bg-card overflow-hidden shadow-2xl shadow-black/40 mt-3">
        {/* Mock header */}
        <div className="border-b border-border px-5 h-11 flex items-center justify-between bg-bg-base/60">
          <span className="text-accent font-bold text-sm">Pipeline Engine</span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Input pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Target", value: "£500k" },
              { label: "Deal value", value: "£10k" },
              { label: "Close rate", value: "20%" },
            ].map((p) => (
              <span key={p.label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-bg-elevated text-xs text-text-muted">
                <span className="text-text-muted">{p.label}:</span>
                <span className="text-text-primary font-medium">{p.value}</span>
              </span>
            ))}
          </div>

          {/* Headline number */}
          <div className="text-center py-6 px-4 rounded-xl border border-border bg-bg-elevated relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent/6 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <p className="text-xs text-accent uppercase tracking-widest mb-2">Your pipeline gap</p>
              <div className="flex items-end justify-center gap-2 mb-1">
                <span className="text-5xl font-bold text-text-primary leading-none">{needed}</span>
                <span className="text-text-muted text-base mb-1">/ month</span>
              </div>
              <p className="text-xs text-text-muted">qualified conversations needed to hit £500k</p>
            </div>
          </div>

          {/* 3 metrics */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Needed / mo", value: needed, colour: "text-accent" },
              { label: "Currently", value: current, colour: "text-red" },
              { label: "Gap / mo", value: gap, colour: "text-red" },
            ].map((m) => (
              <div key={m.label} className="p-3 rounded-xl border border-border bg-bg-elevated text-center">
                <div className={`text-xl font-bold ${m.colour} mb-0.5`}>{m.value}</div>
                <div className="text-xs text-text-muted leading-tight">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Gap bars */}
          <div className="p-4 rounded-xl border border-border bg-bg-elevated space-y-3">
            <div>
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>Needed per month</span>
                <span className="font-medium text-text-primary">{needed}</span>
              </div>
              <div className="h-2.5 bg-bg-card rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent/40 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${neededPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>Currently having</span>
                <span className="font-medium text-red">{current}</span>
              </div>
              <div className="h-2.5 bg-bg-card rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${currentPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Revenue impact */}
          <div className="p-4 rounded-xl border border-border bg-bg-elevated text-center">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Revenue left on the table</p>
            <p className="text-3xl font-bold text-red">£120,000</p>
            <p className="text-xs text-text-muted mt-1">Based on your close rate and deal value</p>
          </div>

          {/* CTA — blurred */}
          <div className="relative">
            <div className="p-4 rounded-xl border border-red/20 bg-red/5 blur-sm pointer-events-none select-none">
              <p className="text-sm font-semibold text-red mb-1">This gap is costing you £120,000 a year.</p>
              <p className="text-xs text-text-muted mb-3">A gap this size doesn't close on its own...</p>
              <div className="w-full py-3 rounded-lg bg-accent text-white text-sm text-center font-medium">
                Let's fix this — book a call →
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-4 py-2 rounded-lg bg-bg-card border border-border text-xs text-text-muted shadow-lg">
                Your personalised recommendation appears here
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-bg-base/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-accent font-bold text-base tracking-tight">Pipeline Engine</span>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-dim text-white text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Calculate my gap
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <main>
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-16 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/6 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-bg-elevated text-xs text-text-muted mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                Free B2B pipeline calculator
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight mb-6">
                Find out exactly how many
                <span className="text-accent block mt-1">conversations you need.</span>
              </h1>
              <p className="text-lg text-text-muted leading-relaxed mb-10 max-w-xl mx-auto">
                4 questions. See the number of qualified conversations you need every month to hit your revenue target — and how much your current gap is costing you.
              </p>
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent hover:bg-accent-dim text-white font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/25"
              >
                Calculate my gap — free
                <ArrowRight size={17} />
              </button>
              <div className="flex items-center justify-center gap-6 mt-6">
                {[
                  { icon: Clock, label: "2 minutes" },
                  { icon: Shield, label: "No credit card" },
                  { icon: BarChart2, label: "Instant result" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5 text-xs text-text-muted">
                    <b.icon size={12} className="text-accent" />
                    {b.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Pain ────────────────────────────────────────────────────────── */}
        <section className="py-16 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs text-accent uppercase tracking-widest mb-4 text-center">The problem</p>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-4 leading-snug">
                Most B2B owners are working to a revenue target<br className="hidden md:block" />
                they can&apos;t reverse-engineer.
              </h2>
              <p className="text-text-muted text-center leading-relaxed mb-12 max-w-xl mx-auto">
                The target is there. The activity is happening. But there&apos;s no clear link between the two — so you never know if you&apos;re on track until it&apos;s too late.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: AlertTriangle,
                  colour: "text-red",
                  bg: "bg-red/10",
                  title: "You don't know your number",
                  body: "How many qualified conversations do you actually need each month? Most owners are guessing.",
                },
                {
                  icon: TrendingUp,
                  colour: "text-amber",
                  bg: "bg-amber/10",
                  title: "Activity without direction",
                  body: "You're doing outreach, taking calls, following up — but with no baseline, it's impossible to know if it's enough.",
                },
                {
                  icon: MessageSquare,
                  colour: "text-accent",
                  bg: "bg-accent/10",
                  title: "Invisible revenue gap",
                  body: "Every month you fall short of your conversation target, there's a revenue cost. Most people only see it at year-end.",
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-5 rounded-xl border border-border bg-bg-card"
                >
                  <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center mb-4`}>
                    <card.icon size={16} className={card.colour} />
                  </div>
                  <p className="font-semibold text-text-primary text-sm mb-2">{card.title}</p>
                  <p className="text-sm text-text-muted leading-relaxed">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Agitate ─────────────────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-bg-card border-y border-border">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-5 text-center"
            >
              <p className="text-xs text-accent uppercase tracking-widest">The real cost</p>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary leading-snug">
                The gap doesn&apos;t just sit there.<br />
                It compounds every month you ignore it.
              </h2>
              <p className="text-text-muted leading-relaxed">
                Every month you have fewer qualified conversations than you need, you&apos;re losing potential revenue. It doesn&apos;t show up as a loss on a balance sheet — but it&apos;s just as real. And because most owners don&apos;t know their number, they don&apos;t realise how much is quietly leaving the business.
              </p>
              <p className="text-text-muted leading-relaxed">
                The calculator makes that number visible. <span className="text-text-primary font-medium">Once you see it, you can&apos;t unsee it.</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Solution ────────────────────────────────────────────────────── */}
        <section className="py-16 px-6 border-b border-border">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs text-accent uppercase tracking-widest mb-4">The solution</p>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-5 leading-snug">
                The Pipeline Gap Calculator gives you<br className="hidden md:block" />
                your number in under 2 minutes.
              </h2>
              <p className="text-text-muted leading-relaxed mb-12 max-w-xl mx-auto">
                Answer 4 questions about your revenue target, deal value, close rate and current conversations. We&apos;ll show you exactly how big the gap is — and what it&apos;s worth.
              </p>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 mb-12 max-w-lg mx-auto">
              {[
                { icon: Target,         label: "Conversations needed", sub: "per month" },
                { icon: MessageSquare,  label: "Your current gap",     sub: "vs target" },
                { icon: TrendingUp,     label: "Revenue impact",       sub: "per year" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-4 rounded-xl border border-border bg-bg-card text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-2">
                    <item.icon size={14} className="text-accent" />
                  </div>
                  <p className="text-xs font-medium text-text-primary leading-tight">{item.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.sub}</p>
                </motion.div>
              ))}
            </div>

            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent hover:bg-accent-dim text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/25"
            >
              Calculate my gap
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* ── Results mockup ──────────────────────────────────────────────── */}
        <section className="py-20 px-6 border-b border-border relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/4 rounded-full blur-[80px]" />
          </div>
          <div className="max-w-3xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <p className="text-xs text-accent uppercase tracking-widest mb-4">See what you get</p>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
                Here&apos;s what your results look like
              </h2>
              <p className="text-text-muted max-w-md mx-auto">
                Your gap number. Your revenue impact. A what-if panel to model scenarios. And a clear next step.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <ResultsMockup />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-center mt-10"
            >
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent hover:bg-accent-dim text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/25"
              >
                Calculate my real gap
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────────────── */}
        <section className="py-16 px-6 border-b border-border">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <p className="text-xs text-accent uppercase tracking-widest mb-4">How it works</p>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Four questions. Your number.</h2>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", label: "Revenue target", body: "What do you want the business to generate this year?" },
                { step: "02", label: "Average deal value", body: "What does a typical new client bring in annually?" },
                { step: "03", label: "Close rate", body: "What % of qualified conversations do you convert?" },
                { step: "04", label: "Current conversations", body: "How many qualified conversations are you having per month right now?" },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex flex-col gap-2"
                >
                  <span className="text-3xl font-bold text-accent/20 leading-none">{s.step}</span>
                  <p className="font-semibold text-text-primary text-sm">{s.label}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{s.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About Gareth ────────────────────────────────────────────────── */}
        <section className="py-16 px-6 border-b border-border bg-bg-card">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs text-accent uppercase tracking-widest mb-8 text-center">Built by</p>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-20 h-20 rounded-2xl border-2 border-accent/30 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/gareth-headshot.png"
                    alt="Gareth Wray"
                    width={80}
                    height={80}
                    className="object-cover object-top w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-xl font-bold text-text-primary mb-1">Gareth Wray</p>
                  <p className="text-sm text-accent mb-4">Founder, Pipeline Engine</p>
                  <p className="text-sm text-text-muted leading-relaxed mb-4">
                    I built this because every conversation I had with a B2B owner included some version of &quot;I don&apos;t really know how many leads I need.&quot; They had a revenue target. They had activity. They had no way to connect the two.
                  </p>
                  <p className="text-sm text-text-muted leading-relaxed">
                    This calculator does the maths in 2 minutes. It won&apos;t fix your pipeline — but it will tell you exactly how big the problem is. That&apos;s the first step.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                {[
                  { value: "10+", label: "Years B2B sales" },
                  { value: "4",   label: "Inputs needed" },
                  { value: "3",   label: "Outputs calculated" },
                  { value: "2 min", label: "To complete" },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl border border-border bg-bg-elevated text-center">
                    <p className="text-2xl font-bold text-accent mb-1">{stat.value}</p>
                    <p className="text-xs text-text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section className="py-16 px-6 border-b border-border">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs text-accent uppercase tracking-widest mb-4 text-center">FAQ</p>
              <h2 className="text-2xl font-bold text-text-primary text-center mb-10">Common questions</h2>
              <div className="rounded-xl border border-border bg-bg-card px-6">
                {[
                  {
                    q: "Is this really free?",
                    a: "Yes. No credit card, no strings. The calculator is a free tool. You only give your email to receive a copy of your results.",
                  },
                  {
                    q: "How is the calculation done?",
                    a: "We take your revenue target and divide it by your average deal value to get the number of clients needed. Then we factor in your close rate to work out how many qualified conversations those clients require — spread over 12 months. The gap is the difference between that number and what you're having now.",
                  },
                  {
                    q: "What counts as a qualified conversation?",
                    a: "Discovery calls, warm referral intros, outbound replies that lead to a real conversation — anything where you're speaking to someone who could realistically become a client. Not cold LinkedIn requests or unqualified enquiries.",
                  },
                  {
                    q: "What do I do with the result?",
                    a: "If your gap is small (1–2/month), you can close it through small improvements to your outreach or referral process. If it's 5+, you likely need a system — and that's exactly what Pipeline Engine builds. There's an option to book a call if the numbers suggest it makes sense.",
                  },
                  {
                    q: "What happens with my data?",
                    a: "Your inputs and email are stored securely and used only to send your results and relevant follow-up from Pipeline Engine. Never shared or sold.",
                  },
                ].map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/6 rounded-full blur-[80px] pointer-events-none" />
          <div className="max-w-2xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs text-accent uppercase tracking-widest mb-4">Ready?</p>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-5 leading-snug">
                Find out what your pipeline gap<br />
                <span className="text-accent">is actually costing you.</span>
              </h2>
              <p className="text-text-muted mb-10 max-w-md mx-auto">
                Free. 4 questions. Your gap number, your revenue impact, and a clear next step.
              </p>
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-accent hover:bg-accent-dim text-white font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/25"
              >
                Calculate my gap — free
                <ArrowRight size={17} />
              </button>

              <div className="flex items-center justify-center gap-3 mt-6 text-xs text-text-muted">
                <CheckCircle size={12} className="text-green" />
                <span>Free forever</span>
                <span className="text-border">·</span>
                <CheckCircle size={12} className="text-green" />
                <span>No credit card</span>
                <span className="text-border">·</span>
                <CheckCircle size={12} className="text-green" />
                <span>Results in 2 minutes</span>
              </div>

              <div className="flex items-center justify-center gap-3 mt-8">
                <div className="w-8 h-8 rounded-full border-2 border-accent/30 overflow-hidden">
                  <Image src="/images/gareth-headshot.png" alt="Gareth" width={32} height={32} className="object-cover object-top" />
                </div>
                <p className="text-xs text-text-muted">
                  Or book a call directly with{" "}
                  <a
                    href="https://cal.com/gareth-wray/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline inline-flex items-center gap-1"
                  >
                    Gareth <Calendar size={11} />
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-6 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-accent font-bold text-sm">Pipeline Engine</span>
            <p className="text-xs text-text-muted">
              © 2025 Pipeline Engine · A free tool by{" "}
              <a href="https://thepipelineengine.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                thepipelineengine.com
              </a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
