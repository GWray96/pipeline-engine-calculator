export interface QuestionOption {
  label: string;
  text: string;
  score: number;
}

export interface Question {
  id: number;
  category: string;
  text: string;
  options: QuestionOption[];
}

export interface CategoryDef {
  questions: number[];
  max: number;
}

export interface Band {
  min: number;
  max: number;
  label: string;
  color: string;
  desc: string;
}

export interface Fix {
  title: string;
  description: string;
}

export interface ResultData {
  summary: string;
  fixes: Fix[];
}

export const QUESTIONS: Question[] = [
  { id: 1, category: "System", text: "If you took 2 weeks off tomorrow, would qualified client enquiries still land in your inbox?", options: [{ label: "A", text: "Yes — the system handles it whether I am there or not", score: 10 }, { label: "B", text: "Maybe 1 or 2 — but it would feel fragile", score: 5 }, { label: "C", text: "No. It would go quiet pretty quickly", score: 0 }] },
  { id: 2, category: "Visibility", text: "When a prospect searches for a recruitment agency in your niche, can they find you?", options: [{ label: "A", text: "Yes — we rank well and our content positions us as the authority", score: 10 }, { label: "B", text: "We have a website but we are not easy to find online", score: 5 }, { label: "C", text: "Unlikely — we have not built any kind of online presence", score: 0 }] },
  { id: 3, category: "Consistency", text: "Where did your last 3 new clients come from?", options: [{ label: "A", text: "A mix of inbound, referrals, and structured outreach", score: 10 }, { label: "B", text: "Mostly warm relationships or word of mouth", score: 5 }, { label: "C", text: "Honestly — I could not give you a clear pattern", score: 0 }] },
  { id: 4, category: "Team", text: "If your most active BD person left this week, what would happen to your pipeline?", options: [{ label: "A", text: "The system keeps generating leads — it is not built around one person", score: 10 }, { label: "B", text: "It would take a hit, but we would manage", score: 5 }, { label: "C", text: "It would be a serious problem — that person is the pipeline", score: 0 }] },
  { id: 5, category: "System", text: "Is your client acquisition process documented anywhere — step by step?", options: [{ label: "A", text: "Yes — written down, anyone on the team could follow it", score: 10 }, { label: "B", text: "Sort of — but it lives in my head more than on paper", score: 5 }, { label: "C", text: "No — it is improvised based on what has worked before", score: 0 }] },
  { id: 6, category: "Consistency", text: "How clearly can you see your revenue picture 90 days from now?", options: [{ label: "A", text: "Very clearly — I have a pipeline view I actually trust", score: 10 }, { label: "B", text: "Roughly — but there is real uncertainty in there", score: 5 }, { label: "C", text: "Genuinely not sure — it is more guess than forecast", score: 0 }] },
  { id: 7, category: "Team", text: "When consultants need vacancies to fill, what actually happens?", options: [{ label: "A", text: "They pull from a pipeline the system keeps warm independently", score: 10 }, { label: "B", text: "They rely on their own networks and cold calling", score: 5 }, { label: "C", text: "The desks go quiet until something comes in", score: 0 }] },
  { id: 8, category: "Visibility", text: "How often do you receive an inbound enquiry from someone who found you online?", options: [{ label: "A", text: "Regularly — at least once or twice a month", score: 10 }, { label: "B", text: "Occasionally — a handful of times a year", score: 5 }, { label: "C", text: "Rarely or never — they do not find us, we find them", score: 0 }] },
  { id: 9, category: "System", text: "What happens to business development when you are deep in a major delivery?", options: [{ label: "A", text: "It continues — the system does not need me to stay active", score: 10 }, { label: "B", text: "It slows significantly", score: 5 }, { label: "C", text: "BD basically stops when I am focused on delivery", score: 0 }] },
  { id: 10, category: "Visibility", text: "Be honest: how much of your pipeline depends on your personal energy and relationships?", options: [{ label: "A", text: "Mostly the system — my network is a bonus, not the main engine", score: 10 }, { label: "B", text: "About 50/50 — a mix of both", score: 5 }, { label: "C", text: "Almost entirely me — if I slow down, the pipeline does too", score: 0 }] },
];

export const CATEGORIES: Record<string, CategoryDef> = {
  Visibility: { questions: [2, 8, 10], max: 30 },
  System: { questions: [1, 5, 9], max: 30 },
  Team: { questions: [4, 7], max: 20 },
  Consistency: { questions: [3, 6], max: 20 },
};

export const CAT_DESCS: Record<string, string> = {
  Visibility: "How easy it is for cold prospects to find and trust you online",
  System: "Whether your BD process is documented, repeatable, and runs without you",
  Team: "How distributed or founder-dependent your pipeline generation is",
  Consistency: "How predictable and reliable your new client flow is month to month",
};

export const BANDS: Band[] = [
  { min: 0, max: 25, label: "Critical", color: "#E84040", desc: "Almost everything about how your agency wins new business depends on you personally. Common — but it needs fixing now." },
  { min: 26, max: 50, label: "At Risk", color: "#E87830", desc: "There are early foundations in place, but the pipeline still leans heavily on you. One slow patch would expose the cracks." },
  { min: 51, max: 75, label: "Building", color: "#E8A020", desc: "You are ahead of most agency owners at your stage. But there are clear gaps that will cap your growth if they go unaddressed." },
  { min: 76, max: 100, label: "Systemised", color: "#40C880", desc: "Your pipeline has real independence from any one person. The work now is scaling what is working and closing the remaining gaps." },
];

export const FALLBACK_FIXES: Record<string, Fix> = {
  Visibility: { title: "Fix Your Online Findability", description: "Cold prospects cannot find you, which means you are invisible to anyone outside your existing network. Start with your LinkedIn headline and post three times a week with insight content that speaks directly to your ideal client problems." },
  System: { title: "Document Your BD Process", description: "If your client acquisition process lives in your head, it is a habit — not a system. Spend 90 minutes this week writing down every step of how you find and win new clients." },
  Team: { title: "Separate Pipeline From People", description: "Your BD depends too heavily on specific individuals, which makes it fragile by design. Before you hire your next consultant, build the system that will feed them — not the other way around." },
  Consistency: { title: "Build a Weekly Pipeline Review", description: "You cannot fix what you cannot see. Set a 15-minute Monday morning pipeline review — what is in, what is expected, and what needs action this week." },
};
