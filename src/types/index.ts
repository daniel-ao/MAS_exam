export type CourseId = 'course-1' | 'course-2' | 'course-3';

export type QuestionDifficulty = 'foundation' | 'intermediate' | 'advanced' | 'challenge';

export interface CheckpointQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'true-false' | 'calculation';
  options: string[];
  correctAnswers: number[]; // 0-indexed indices
  explanation: string;
  whyOptionsIncorrect?: Record<number, string>;
  hint?: string;
  difficulty: QuestionDifficulty;
  sourceSlide?: number;
}

export interface WorkedStep {
  title: string;
  explanation: string;
  math?: string;
}

export interface WorkedExample {
  title: string;
  context?: string;
  problem: string;
  steps: WorkedStep[];
  conclusion: string;
}

export interface FormulaEntry {
  name: string;
  latex: string;
  explanation: string;
  variables: { symbol: string; description: string }[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: CourseId;
  title: string;
  /** Source deck number (see content/decks.ts); sourcePages are slide numbers in that deck. */
  deck: number;
  sourcePages: number[];
  summary: string;
  understand: {
    overview: string;
    detailedExplanation: string;
    keyPoints: string[];
  };
  visualize?: {
    title: string;
    description: string;
    customVisualType?: string;
  };
  labId?: string;
  workedExample?: WorkedExample;
  examPitfalls?: string[];
  formulas?: FormulaEntry[];
  checkpoints: CheckpointQuestion[];
  references?: string[];
}

/** An exam-bank question: a checkpoint plus the deck its slide reference belongs to. */
export type ExamQuestion = CheckpointQuestion & { courseId: CourseId; deck: number; category: string };

export interface Module {
  id: string;
  courseId: CourseId;
  title: string;
  description: string;
  sourcePagesRange: string;
  lessons: Lesson[];
}

export interface Course {
  id: CourseId;
  title: string;
  code: string;
  subtitle: string;
  instructor: string;
  ects: number;
  totalPages: number;
  modules: Module[];
}

export type GlossaryCategory =
  | 'Agents & Architectures'
  | 'Organizations'
  | 'Reputation'
  | 'Voting'
  | 'Games & Norms'
  | 'Logic Foundations'
  | 'Knowledge & Belief'
  | 'Action & Agency'
  | 'Manipulation';

export interface GlossaryItem {
  term: string;
  definition: string;
  category: GlossaryCategory;
  formula?: string;
  relatedLessonId?: string;
  sourceSlideRef?: string;
}

export interface ManifestEntry {
  course: CourseId;
  deck: number;
  page: number;
  title: string;
  destination_module: string;
  destination_lesson: string;
}

export interface UserProgress {
  completedLessons: string[];
  checkpointAnswers: Record<string, { answers: number[]; isCorrect: boolean; timestamp: number }>;
  bookmarks: string[];
  notes: Record<string, string>;
  confidenceRatings: Record<string, number>; // 1 to 5
  examAttempts: {
    id: string;
    timestamp: number;
    courseId: string;
    totalQuestions: number;
    correctCount: number;
    scorePercent: number;
    timeSpentSeconds: number;
    missedQuestionIds: string[];
  }[];
  // ---- Engagement layer (all optional so older saved progress keeps loading) ----
  xp?: number;
  streak?: { count: number; lastDay: string };
  achievements?: string[];
  labsUsed?: string[];
  bossesBeaten?: string[];
  visitedLessons?: string[];
  firstTryStreak?: number;
  urgentSprintsCompleted?: number;
  urgentCardStats?: Record<string, { good: number; again: number; last: number }>;
}

export type AppView =
  | 'lessons'
  | 'exam'
  | 'formulas'
  | 'glossary'
  | 'comparisons'
  | 'traceability'
  | 'journey'
  | 'cheatsheets'
  | 'examsheet'
  | 'urgent';

