import type { CategoryDef, Band, ResultData } from "@/data/quiz";
import { CATEGORIES, BANDS, FALLBACK_FIXES } from "@/data/quiz";

export interface Answer {
  questionId: number;
  score: number;
  category: string;
}

export interface Scores {
  overall: number;
  Visibility: number;
  System: number;
  Team: number;
  Consistency: number;
}

export function calcScores(answers: Answer[]): Scores {
  const result: Scores = {
    overall: 0,
    Visibility: 0,
    System: 0,
    Team: 0,
    Consistency: 0,
  };
  const keys = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];
  for (const name of keys) {
    const def = CATEGORIES[name] as CategoryDef;
    let total = 0;
    for (const qid of def.questions) {
      const ans = answers.find((a) => a.questionId === qid);
      if (ans) total += ans.score;
    }
    result[name as keyof Scores] = Math.round((total / def.max) * 100);
  }
  result.overall = answers.reduce((sum, a) => sum + a.score, 0);
  return result;
}

export function getBand(score: number): Band {
  return BANDS.find((b) => score >= b.min && score <= b.max) ?? BANDS[0];
}

export function barColor(score: number): string {
  if (score <= 33) return "#E84040";
  if (score <= 55) return "#E87830";
  if (score <= 75) return "#E8A020";
  return "#40C880";
}

export function getFallbackResult(scores: Scores): ResultData {
  const entries: [string, number][] = [
    ["Visibility", scores.Visibility],
    ["System", scores.System],
    ["Team", scores.Team],
    ["Consistency", scores.Consistency],
  ];
  entries.sort((a, b) => a[1] - b[1]);
  const fixes = entries.slice(0, 3).map(([name]) => FALLBACK_FIXES[name]);
  const band = getBand(scores.overall);
  return { summary: band.desc, fixes };
}
