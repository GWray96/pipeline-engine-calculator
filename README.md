# Pipeline Dependency Score

A Next.js app for the Pipeline Engine Pipeline Dependency Score — a 3-minute quiz that helps recruitment agency owners understand how dependent their pipeline is on them personally.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- Styling matches the [Pipeline Engine landing page](https://pipeline-engine-lanndingpage.vercel.app)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` — Next.js App Router (layout, page, globals)
- `src/components/` — Quiz UI (Intro, Quiz, EmailCapture, Loading, Results)
- `src/data/quiz.ts` — Questions, categories, bands, fallback fixes
- `src/lib/scoring.ts` — Score calculation and band logic

## Backend (Coming Soon)

Supabase integration for storing results and sending emails will be added in a future phase. Currently uses fallback results based on category scores.

## Build

```bash
npm run build
npm start
```
