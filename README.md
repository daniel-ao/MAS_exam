# Multi-Agent Systems — Interactive Exam Preparation Platform

> **Université Côte d'Azur — Master 2 IA**
> **Course**: SMEIA305 (ECUE Multiagent systems)
> **Exam**: Thursday 12 November, 15:00 (1h30)

**Live site:** https://daniel-ao.github.io/MAS_exam/

An interactive web platform for studying the Multi-Agent Systems course and preparing for its exam. It covers Chapters 1–3 and the TD: all 241 slides of the nine lecture parts and the four TD pages are mapped to a lesson. The platform turns them into lessons you can read, labs you can play with, quizzes, a mock exam and a fast revision mode. You can also open the original slides next to the lesson at any time.

## What's inside

| | |
|---|---|
| **3 chapters · 17 modules · 53 lessons** | Agents & organizations → Reputation, voting & games → Modal logic, model checking & KBE manipulation |
| **241 original slides** | Shown in a resizable panel that docks beside the lesson, one deck per lecture part |
| **12 interactive labs** | Kripke model checker, neighborhood model checker, proof workshop, reputation & Sybil simulator, voting lab, Nash & norm design lab, BDI robot, flocking, subsumption, organizations, environments, KBE manipulation builder |
| **149 practice questions** | 112 lesson checkpoints + a 37-question exam bank with explanations |
| **Mock exam** | Timed, graded out of 20 with French honours, per-chapter analytics, retake-missed |
| **⚡ Urgent Study** | Time-boxed flashcard sprints (15/30/60 min) with an exam countdown |
| **Agent Society** | XP, levels, streaks, achievements, module bosses and a map that comes online as you master lessons |
| **📜 Cheat sheets & 📄 Exam Sheet** | One card per lesson, and the whole course on one recto/verso A4 sheet |
| **Reference views** | Formula sheet, glossary (65 terms), comparison matrices, 241-slide traceability matrix |

Everything runs in the browser. Your progress is saved locally and can be exported and imported as JSON.

## Exam scope covered

- **Fundamentals of MAS**: agent, environment, reactive vs cognitive agents, BDI, organizations.
- **Reputation systems**: Beta reputation, witnesses and credibility, Sybil attacks.
- **Voting systems**: plurality, majority, approval, Borda, runoff, Condorcet, manipulation.
- **Game theory**: games, best responses, Nash equilibria (Prisoner's Dilemma), norms.
- **Modal logic & model checking**: epistemic (S5) and doxastic (KD45) logic, STIT, axioms K, T, D, 4, 5, rules MP, US and Nec, correspondence proofs, the S5 system, neighborhood model checking.
- **KBE logic**: formal modelling of lying, persuasion, coercion and manipulation.

## Documentation

- **[FEATURES.md](FEATURES.md)**: the platform's functionalities and the syllabus it covers.
- **[USAGE.md](USAGE.md)**: running it locally, building, deploying, and using each part of the site.
- **[LICENSE](LICENSE)**: terms of use.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · KaTeX · lucide-react · canvas-confetti.
Slide images were rendered from the lecture decks; the modal-logic labs share a small parser and model checker in `src/logic/modal.ts`.

## License

© 2026 Daniel Abou Orm. All rights reserved.
You are welcome to **use the website** to study. You may **not** copy, re-host, redistribute or build derivative or competing products from this project's code, design or concept. See [LICENSE](LICENSE) for details.

The lecture slides and course material belong to their respective authors (the course instructors / Université Côte d'Azur) and are not covered by this license.
