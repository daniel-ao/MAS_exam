# Usage Guide

How to run the platform and get the most out of it.
For the full feature list, see [FEATURES.md](FEATURES.md).

---

## Using the hosted site

Open **https://daniel-ao.github.io/MAS_exam/**. You don't need to install anything. Your progress is stored in your browser.

## Running locally

Requirements: **Node.js 20+** and npm.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds into dist/
npm run preview    # serves the production build locally
```

> The production build uses the base path `/MAS_exam/` (see `vite.config.ts`) so it can be served from GitHub Pages.

## Deployment (GitHub Pages)

Every push to `main` triggers `.github/workflows/deploy.yml`, which installs the dependencies with `npm ci`, runs `npm run build` and publishes `dist/` to GitHub Pages. In the repository settings, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** once. You can also run the workflow by hand from the **Actions** tab.

## Where the content lives

| Path | Content |
|---|---|
| `src/content/course1.ts`, `course2.ts`, `course3a.ts`, `course3b.ts` | Lessons, checkpoints, worked examples per chapter |
| `src/content/decks.ts` | The 10 slide decks (9 lecture parts + TD) and slide-reference helpers |
| `src/content/examQuestions.ts`, `formulas.ts`, `glossary.ts`, `comparisons.ts` | Exam bank, formula sheet, glossary, comparison matrices |
| `src/cheatsheet/examSheet.ts` | The recto/verso Exam Sheet |
| `src/logic/modal.ts` | Formula parser and Kripke / neighborhood model checker used by the labs |
| `src/interactions/` | The interactive labs |
| `public/slides/<deck>/slide-NN.jpg` | Rendered slides |

Slide references in content use the form `Part 2.1, Slide 7` or `TD, Slide 3`.

---

## Studying with the platform

### Suggested workflow

1. **Learn**: pick a chapter in the top bar and go through the lessons with **Next Lesson**. Read the theory, play with the lab, follow the worked example, then answer the checkpoints.
2. **Check against the slides**: click any *Part · Slide* badge or the **Slides** button. The panel docks on the right; switch parts with its dropdown.
3. **Lock it in**: mark the lesson **Mastered** once the checkpoints are solved, and fight the **Module Boss** at the end of each module.
4. **Revise fast**: use **⚡ Urgent** for timed flashcard sprints (the countdown shows the time left before the exam).
5. **Test yourself**: run a timed **Exam** and retake the questions you missed.
6. **Condense**: read the **Cheat Sheets**, then copy or print the **Exam Sheet**.

### The modal-logic labs

The Kripke and neighborhood model checkers accept formulas typed in ASCII or Unicode:

| Write | Meaning |
|---|---|
| `~p`, `¬p`, `!p` | negation |
| `p & q`, `p ∧ q` / `p \| q`, `p ∨ q` | conjunction / disjunction |
| `p -> q`, `p => q`, `p → q` / `p <-> q` | implication / equivalence |
| `[]p`, `□p` / `<>p`, `◇p` | box / diamond on the default relation |
| `K p`, `K_a p`, `B p`, `E_i p`, `BA_i p`, `E^d_i p` | modality on the relation named after the agent (or the operator) |
| `T`, `⊤` / `F`, `⊥` | true / false |

Each lab has presets for the models of the slides and of the TD.

### Keyboard shortcuts

| Keys | Where | Action |
|---|---|---|
| `Ctrl/⌘ + K` | Anywhere | Open/close search |
| `←` `→` | Slide panel (pointer over it) | Previous / next slide |
| `Esc` | Slide panel, lab pop-up, menus | Close |
| `Space` / `Enter` | Urgent Study | Reveal the card / continue |
| `1` / `2` | Urgent Study | Review again / Got it |

### Your progress

Everything is saved in your browser (completed lessons, answers, notes, bookmarks, confidence ratings, exam attempts, XP, streak, achievements). Use **% menu → Export Progress** to back up and **Import Progress** to restore. **Reset All Progress** erases everything.
