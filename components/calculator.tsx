"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  Target,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ChevronRight,
  Link2,
  ChevronDown,
  RotateCcw,
  Zap,
  Mail,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  revenueTarget: number;
  avgDealValue: number;
  closeRate: number;
  currentConversations: number;
}

type Screen = "intro" | "step" | "calculating" | "email" | "results";

// ─── Calculation engine ───────────────────────────────────────────────────────

function calculate(data: FormData) {
  const clientsNeeded = data.revenueTarget / data.avgDealValue;
  const conversationsNeeded = Math.ceil(
    clientsNeeded / (data.closeRate / 100) / 12
  );
  const gap = Math.max(0, conversationsNeeded - data.currentConversations);
  const revenueGap = Math.round(
    gap * 12 * (data.closeRate / 100) * data.avgDealValue
  );
  const onTrack = gap === 0;
  return { clientsNeeded, conversationsNeeded, gap, revenueGap, onTrack };
}

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    let raf: number;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);
  return count;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `£${(n / 1_000).toFixed(0)}k`;
  return `£${n}`;
}

function formatCurrencyFull(n: number) {
  return "£" + n.toLocaleString("en-GB");
}

// ─── Slider + quick-select input ──────────────────────────────────────────────

interface SliderInputProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  presets: { label: string; value: number }[];
  prefix?: string;
  suffix?: string;
  format?: (v: number) => string;
}

function SliderInput({
  value,
  onChange,
  min,
  max,
  step,
  presets,
  prefix = "",
  suffix = "",
  format,
}: SliderInputProps) {
  const display = format
    ? format(value)
    : `${prefix}${value.toLocaleString("en-GB")}${suffix}`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="text-4xl md:text-5xl font-bold text-text-primary">
          {display}
        </span>
      </div>
      <div className="px-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-text-muted">
            {prefix}
            {min.toLocaleString("en-GB")}
            {suffix}
          </span>
          <span className="text-xs text-text-muted">
            {prefix}
            {max.toLocaleString("en-GB")}
            {suffix}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className={`px-4 py-2 rounded-lg border text-sm transition-all ${
              value === p.value
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-text-muted hover:border-accent/50 hover:text-text-primary"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-500 ${
            i < current ? "bg-accent" : i === current ? "bg-accent" : "bg-border"
          }`}
          style={{ width: i === current ? 32 : 16 }}
        />
      ))}
      <span className="text-xs text-text-muted ml-2">
        {current + 1} of {total}
      </span>
    </div>
  );
}

// ─── Gap bar ──────────────────────────────────────────────────────────────────

function GapBar({ current, needed }: { current: number; needed: number }) {
  const max = Math.max(needed, current) * 1.2 || 1;
  const currentPct = Math.min((current / max) * 100, 100);
  const neededPct = Math.min((needed / max) * 100, 100);
  const onTrack = current >= needed;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span>Needed per month</span>
          <span className="text-text-primary font-medium">{needed}</span>
        </div>
        <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent/40 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${neededPct}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span>Currently having</span>
          <span className={`font-medium ${onTrack ? "text-green" : "text-red"}`}>
            {current}
          </span>
        </div>
        <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${onTrack ? "bg-green" : "bg-red"}`}
            initial={{ width: 0 }}
            animate={{ width: `${currentPct}%` }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── CTA config ───────────────────────────────────────────────────────────────

function getCtaConfig(gap: number, revenueGap: number) {
  if (gap === 0) {
    return {
      severity: "green" as const,
      icon: CheckCircle,
      heading: "Your pipeline looks healthy.",
      body: "You're on track — but most businesses at this stage have no system to fall back on if referrals slow down. Let's make sure yours is built to last.",
      ctaLabel: "Let's make sure it stays that way",
      urgent: false,
    };
  }
  if (gap <= 2) {
    return {
      severity: "amber" as const,
      icon: TrendingUp,
      heading: "You're close — but the gap is real.",
      body: "Missing 1–2 conversations a month sounds small. Over a year that's a meaningful amount of revenue quietly leaving the business.",
      ctaLabel: "See how to close the gap",
      urgent: false,
    };
  }
  if (gap <= 5) {
    return {
      severity: "accent" as const,
      icon: AlertTriangle,
      heading: "There's a real gap here.",
      body: "This is exactly the situation Pipeline Engine is built for. The right system running every month would close this gap — and keep it closed.",
      ctaLabel: "Book a free discovery call",
      urgent: true,
    };
  }
  return {
    severity: "red" as const,
    icon: AlertTriangle,
    heading: `This gap is costing you ${formatCurrencyFull(revenueGap)} a year.`,
    body: "A gap this size doesn't close on its own. Referrals won't fix it. More effort won't sustain it. The only way out is a system.",
    ctaLabel: "Let's fix this — book a call",
    urgent: true,
  };
}

// ─── What-if sliders ──────────────────────────────────────────────────────────

function WhatIfPanel({
  base,
  adjusted,
  onChange,
  onReset,
}: {
  base: FormData;
  adjusted: FormData;
  onChange: (key: keyof FormData, v: number) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isDirty =
    adjusted.closeRate !== base.closeRate ||
    adjusted.currentConversations !== base.currentConversations;

  return (
    <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <span className="flex items-center gap-2">
          <Zap size={14} className="text-accent" />
          What if I changed something?
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-6 border-t border-border pt-5">
              {/* Close rate */}
              <div>
                <div className="flex justify-between mb-3">
                  <p className="text-xs text-text-muted uppercase tracking-widest">
                    Close rate
                  </p>
                  <span className="text-sm font-semibold text-accent">
                    {adjusted.closeRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={80}
                  step={5}
                  value={adjusted.closeRate}
                  onChange={(e) => onChange("closeRate", Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Current conversations */}
              <div>
                <div className="flex justify-between mb-3">
                  <p className="text-xs text-text-muted uppercase tracking-widest">
                    Monthly conversations
                  </p>
                  <span className="text-sm font-semibold text-accent">
                    {adjusted.currentConversations}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={adjusted.currentConversations}
                  onChange={(e) =>
                    onChange("currentConversations", Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {isDirty && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  <RotateCcw size={11} />
                  Reset to my numbers
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────

function Results({
  originalData,
  onReset,
}: {
  originalData: FormData;
  onReset: () => void;
}) {
  const [adjusted, setAdjusted] = useState<FormData>(originalData);
  const [copied, setCopied] = useState(false);

  const { conversationsNeeded, gap, revenueGap, onTrack } = calculate(adjusted);
  const cta = getCtaConfig(gap, revenueGap);
  const CtaIcon = cta.icon;

  const animNeeded = useCountUp(conversationsNeeded, 1000, 200);
  const animCurrent = useCountUp(adjusted.currentConversations, 800, 400);
  const animGap = useCountUp(gap, 900, 600);
  const animRevenue = useCountUp(revenueGap, 1400, 800);

  const severityColour = {
    green: "text-green",
    amber: "text-amber",
    accent: "text-accent",
    red: "text-red",
  }[cta.severity];

  const severityBorder = {
    green: "border-green/30 bg-green/5",
    amber: "border-amber/30 bg-amber/5",
    accent: "border-accent/30 bg-accent/5",
    red: "border-red/30 bg-red/5",
  }[cta.severity];

  function handleShare() {
    const params = new URLSearchParams({
      r: originalData.revenueTarget.toString(),
      d: originalData.avgDealValue.toString(),
      c: originalData.closeRate.toString(),
      cv: originalData.currentConversations.toString(),
    });
    const url = `${window.location.origin}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleWhatIfChange(key: keyof FormData, value: number) {
    setAdjusted((prev) => ({ ...prev, [key]: value }));
  }

  function handleWhatIfReset() {
    setAdjusted(originalData);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Input summary */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { label: "Target", value: formatCurrency(originalData.revenueTarget) },
          { label: "Deal value", value: formatCurrency(originalData.avgDealValue) },
          { label: "Close rate", value: `${originalData.closeRate}%` },
        ].map((s) => (
          <span
            key={s.label}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-bg-card text-xs text-text-muted"
          >
            <span className="text-text-muted">{s.label}:</span>
            <span className="text-text-primary font-medium">{s.value}</span>
          </span>
        ))}
      </div>

      {/* Headline result */}
      <div className="text-center py-8 px-6 rounded-2xl border border-border bg-bg-card relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-accent/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="text-xs text-accent uppercase tracking-widest mb-4">
            Your pipeline gap
          </p>
          <div className="flex items-end justify-center gap-3 mb-2">
            <span className="text-6xl md:text-7xl font-bold text-text-primary leading-none">
              {animNeeded}
            </span>
            <span className="text-text-muted text-lg mb-2">/ month</span>
          </div>
          <p className="text-text-muted text-sm">
            qualified conversations needed to hit{" "}
            <span className="text-text-primary">
              {formatCurrency(originalData.revenueTarget)}
            </span>{" "}
            this year
          </p>
        </div>
      </div>

      {/* Three metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Needed / month", value: animNeeded, colour: "text-accent" },
          {
            label: "Currently having",
            value: animCurrent,
            colour: onTrack ? "text-green" : "text-red",
          },
          {
            label: "Gap / month",
            value: animGap,
            colour: onTrack ? "text-green" : "text-red",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="p-4 rounded-xl border border-border bg-bg-card text-center"
          >
            <div className={`text-2xl font-bold ${m.colour} mb-1`}>
              {m.value}
            </div>
            <div className="text-xs text-text-muted leading-tight">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Gap bar */}
      <div className="p-5 rounded-xl border border-border bg-bg-card">
        <GapBar current={adjusted.currentConversations} needed={conversationsNeeded} />
      </div>

      {/* Revenue impact */}
      {!onTrack && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-6 rounded-xl border border-border bg-bg-card text-center"
        >
          <p className="text-xs text-text-muted uppercase tracking-widest mb-2">
            Revenue left on the table this year
          </p>
          <p className="text-4xl md:text-5xl font-bold text-red">
            {formatCurrencyFull(animRevenue)}
          </p>
          <p className="text-xs text-text-muted mt-2">
            Based on your close rate and average deal value
          </p>
        </motion.div>
      )}

      {/* What if panel */}
      <WhatIfPanel
        base={originalData}
        adjusted={adjusted}
        onChange={handleWhatIfChange}
        onReset={handleWhatIfReset}
      />

      {/* CTA block */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className={`p-6 rounded-xl border ${severityBorder}`}
      >
        <div className="flex items-start gap-3 mb-5">
          <CtaIcon size={18} className={`${severityColour} flex-shrink-0 mt-0.5`} />
          <div>
            <p className={`font-semibold ${severityColour} mb-1`}>
              {cta.heading}
            </p>
            <p className="text-sm text-text-muted leading-relaxed">{cta.body}</p>
          </div>
        </div>

        {/* Gareth headshot + booking */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full border-2 border-accent/40 overflow-hidden flex-shrink-0">
            <Image
              src="/images/gareth-headshot.png"
              alt="Gareth Wray"
              width={36}
              height={36}
              className="object-cover object-top w-full h-full"
            />
          </div>
          <p className="text-xs text-text-muted">
            You&apos;re booking directly with{" "}
            <span className="text-text-primary font-medium">Gareth</span> —
            founder of Pipeline Engine
          </p>
        </div>

        <a
          href="https://cal.com/gareth-wray/30min"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
            cta.urgent
              ? "bg-accent hover:bg-accent-dim text-white shadow-lg shadow-accent/20"
              : "border border-border text-text-muted hover:text-text-primary hover:border-accent/50"
          }`}
        >
          <Calendar size={15} />
          {cta.ctaLabel}
          <ArrowRight size={15} />
        </a>
      </motion.div>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onReset}
          className="text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          Start over
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
        >
          <Link2 size={11} />
          {copied ? "Link copied!" : "Share result"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Calculating screen ───────────────────────────────────────────────────────

const CALC_STAGES = [
  "Reading your revenue target…",
  "Factoring in your deal value…",
  "Applying your close rate…",
  "Comparing against your current pipeline…",
  "Calculating your gap…",
];

function Calculating({ data }: { data: FormData }) {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    if (stageIdx >= CALC_STAGES.length - 1) return;
    const t = setTimeout(() => setStageIdx((s) => s + 1), 580);
    return () => clearTimeout(t);
  }, [stageIdx]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="p-10 rounded-2xl border border-border bg-bg-card text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
        <Zap size={24} className="text-accent animate-pulse" />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={stageIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="text-base font-semibold text-text-primary mb-2"
        >
          {CALC_STAGES[stageIdx]}
        </motion.p>
      </AnimatePresence>
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {[
          { label: "Target", value: formatCurrency(data.revenueTarget) },
          { label: "Deal value", value: formatCurrency(data.avgDealValue) },
          { label: "Close rate", value: `${data.closeRate}%` },
          { label: "Conversations", value: `${data.currentConversations}/mo` },
        ].map((item, i) => (
          <motion.span
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-bg-elevated text-xs text-text-muted"
          >
            {item.label}:{" "}
            <span className="text-accent font-medium">{item.value}</span>
          </motion.span>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-6">
        {CALC_STAGES.map((_, i) => (
          <motion.div
            key={i}
            className="h-1 rounded-full bg-accent"
            animate={{ width: i <= stageIdx ? 20 : 6, opacity: i <= stageIdx ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Email capture screen ────────────────────────────────────────────────────

function EmailCapture({
  data,
  onSubmit,
}: {
  data: FormData;
  onSubmit: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { gap, revenueGap, conversationsNeeded } = calculate(data);
  const cta = getCtaConfig(gap, revenueGap);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);

    const { error: dbError } = await supabase.from("calculator_submissions").insert({
      email: email.trim().toLowerCase(),
      revenue_target: data.revenueTarget,
      avg_deal_value: data.avgDealValue,
      close_rate: data.closeRate,
      current_conversations: data.currentConversations,
      conversations_needed: conversationsNeeded,
      gap,
      revenue_gap: revenueGap,
    });

    if (dbError) console.error("Supabase error:", dbError);

    setSubmitting(false);
    onSubmit(email);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Result teaser */}
      <div className="text-center p-8 rounded-2xl border border-border bg-bg-card relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-accent/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="text-xs text-accent uppercase tracking-widest mb-4">Your pipeline gap</p>
          <div className="flex items-end justify-center gap-3 mb-2">
            <span className="text-6xl md:text-7xl font-bold text-text-primary leading-none blur-md select-none">
              {conversationsNeeded}
            </span>
            <span className="text-text-muted text-lg mb-2 blur-md select-none">/ month</span>
          </div>
          <p className="text-sm text-text-muted mt-3">Enter your email to unlock your full breakdown</p>
        </div>
      </div>

      {/* Email form */}
      <div className="p-6 rounded-xl border border-border bg-bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Mail size={15} className="text-accent" />
          <p className="text-sm font-medium text-text-primary">Where should we send your results?</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            autoFocus
            className="w-full px-4 py-3 rounded-lg border border-border bg-bg-elevated text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            disabled={submitting || !email.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-accent hover:bg-accent-dim text-white font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Saving your results…</>
            ) : (
              <>View my results <ArrowRight size={15} /></>
            )}
          </button>
        </form>
        <p className="text-xs text-text-muted text-center mt-3">
          We&apos;ll also send a copy to your inbox. No spam, ever.
        </p>
      </div>
    </motion.div>
  );
}

// ─── Intro screen ─────────────────────────────────────────────────────────────

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center p-8 md:p-10 rounded-2xl border border-border bg-bg-card relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-accent/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-bg-elevated text-xs text-text-muted mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            Free tool — no email required
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
            Find your{" "}
            <span className="text-accent">pipeline gap</span>
          </h1>
          <p className="text-text-muted leading-relaxed mb-8 max-w-sm mx-auto">
            Answer 4 quick questions. See exactly how many qualified
            conversations you need every month to hit your revenue target —
            and how much the current gap is costing you.
          </p>

          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent hover:bg-accent-dim text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/20 text-sm mb-4"
          >
            Calculate my gap
            <ArrowRight size={16} />
          </button>

          <p className="text-xs text-text-muted">Takes 2 minutes</p>
        </div>
      </div>

      {/* What you'll get */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, label: "Conversations needed", sub: "per month" },
          { icon: MessageSquare, label: "Your current gap", sub: "vs target" },
          { icon: TrendingUp, label: "Revenue impact", sub: "per year" },
        ].map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-xl border border-border bg-bg-card text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-2">
              <item.icon size={14} className="text-accent" />
            </div>
            <p className="text-xs font-medium text-text-primary leading-tight">
              {item.label}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-text-muted">
        A free tool by{" "}
        <a
          href="https://thepipelineengine.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Pipeline Engine
        </a>
      </p>
    </motion.div>
  );
}

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  {
    key: "revenueTarget" as keyof FormData,
    icon: Target,
    label: "Revenue target",
    question: "What's your annual revenue target?",
    hint: "The total revenue you want the business to generate this year.",
    min: 100000,
    max: 2000000,
    step: 25000,
    prefix: "£",
    suffix: "",
    format: (v: number) => formatCurrency(v),
    presets: [
      { label: "£250k", value: 250000 },
      { label: "£500k", value: 500000 },
      { label: "£750k", value: 750000 },
      { label: "£1m", value: 1000000 },
    ],
  },
  {
    key: "avgDealValue" as keyof FormData,
    icon: TrendingUp,
    label: "Average deal value",
    question: "What's your average client value?",
    hint: "The typical annual revenue one new client brings in.",
    min: 1000,
    max: 100000,
    step: 1000,
    prefix: "£",
    suffix: "",
    format: (v: number) => formatCurrency(v),
    presets: [
      { label: "£5k", value: 5000 },
      { label: "£10k", value: 10000 },
      { label: "£25k", value: 25000 },
      { label: "£50k", value: 50000 },
    ],
  },
  {
    key: "closeRate" as keyof FormData,
    icon: ChevronRight,
    label: "Close rate",
    question: "What % of qualified conversations do you convert?",
    hint: "If you have 10 discovery calls, how many become paying clients? 20–30% is typical for B2B services.",
    min: 5,
    max: 80,
    step: 5,
    prefix: "",
    suffix: "%",
    format: undefined,
    presets: [
      { label: "10%", value: 10 },
      { label: "20%", value: 20 },
      { label: "30%", value: 30 },
      { label: "50%", value: 50 },
    ],
  },
  {
    key: "currentConversations" as keyof FormData,
    icon: MessageSquare,
    label: "Current conversations",
    question: "How many qualified conversations per month right now?",
    hint: "Discovery calls, referral intros, warm outreach replies — anything that could realistically become a client.",
    min: 0,
    max: 30,
    step: 1,
    prefix: "",
    suffix: "",
    format: undefined,
    presets: [
      { label: "0", value: 0 },
      { label: "1–2", value: 1 },
      { label: "3–5", value: 3 },
      { label: "5+", value: 5 },
    ],
  },
];

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS: FormData = {
  revenueTarget: 500000,
  avgDealValue: 10000,
  closeRate: 20,
  currentConversations: 2,
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

// ─── Main calculator ──────────────────────────────────────────────────────────

export default function Calculator() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>(DEFAULTS);

  // Read shared URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("r");
    const d = params.get("d");
    const c = params.get("c");
    const cv = params.get("cv");
    if (r && d && c && cv) {
      setData({
        revenueTarget: Number(r),
        avgDealValue: Number(d),
        closeRate: Number(c),
        currentConversations: Number(cv),
      });
      setScreen("results");
    }
  }, []);

  const goNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      setScreen("calculating");
      setTimeout(() => setScreen("email"), 3200);
    }
  }, [step]);

  const goBack = useCallback(() => {
    if (screen === "step" && step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    } else if (screen === "step" && step === 0) {
      setScreen("intro");
    }
  }, [screen, step]);

  // Enter key navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && screen === "step") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [screen, goNext]);

  function reset() {
    setData(DEFAULTS);
    setStep(0);
    setDirection(1);
    setScreen("intro");
    window.history.replaceState({}, "", window.location.pathname);
  }

  const currentStep = STEPS[step];
  const StepIcon = currentStep?.icon;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-bg-base/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={reset}
            className="text-accent font-bold text-base tracking-tight hover:text-accent-dim transition-colors"
          >
            Pipeline Engine
          </button>
          {screen === "step" && (
            <StepIndicator current={step} total={STEPS.length} />
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          {/* Background glow */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-accent/6 blur-[120px]" />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            {screen === "intro" && (
              <motion.div key="intro">
                <Intro onStart={() => setScreen("step")} />
              </motion.div>
            )}

            {screen === "step" && (
              <motion.div
                key={`step-${step}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Step card */}
                <div className="p-8 md:p-10 rounded-2xl border border-border bg-bg-card">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <StepIcon size={15} className="text-accent" />
                    </div>
                    <span className="text-xs text-accent uppercase tracking-widest">
                      {currentStep.label}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
                    {currentStep.question}
                  </h2>
                  <p className="text-sm text-text-muted mb-8 leading-relaxed">
                    {currentStep.hint}
                  </p>
                  <SliderInput
                    value={data[currentStep.key] as number}
                    onChange={(v) =>
                      setData((prev) => ({ ...prev, [currentStep.key]: v }))
                    }
                    min={currentStep.min}
                    max={currentStep.max}
                    step={currentStep.step}
                    presets={currentStep.presets}
                    prefix={currentStep.prefix}
                    suffix={currentStep.suffix}
                    format={currentStep.format}
                  />
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={goBack}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text-muted hover:text-text-primary hover:border-accent/40 transition-all text-sm"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={goNext}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-dim text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98] text-sm shadow-lg shadow-accent/20"
                    >
                      {step === STEPS.length - 1 ? "Calculate my gap" : "Next"}
                      <ArrowRight size={14} />
                    </button>
                    {screen === "step" && (
                      <span className="text-xs text-text-muted opacity-60">
                        or press Enter
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {screen === "calculating" && (
              <motion.div key="calculating">
                <Calculating data={data} />
              </motion.div>
            )}

            {screen === "email" && (
              <motion.div key="email">
                <EmailCapture
                  data={data}
                  onSubmit={() => setScreen("results")}
                />
              </motion.div>
            )}

            {screen === "results" && (
              <motion.div
                key="results"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <Results originalData={data} onReset={reset} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
