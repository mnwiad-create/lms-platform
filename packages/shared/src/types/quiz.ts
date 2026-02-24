export enum QuizType {
  MCQ = 'MCQ',
  ESSAY = 'ESSAY',
  MATCHING = 'MATCHING',
  DRAG_DROP = 'DRAG_DROP',
}

export enum GradingStatus {
  PENDING = 'PENDING',
  GRADED = 'GRADED',
}

export interface Quiz {
  id: string;
  courseId: string;
  titleTh: string;
  titleEn: string;
  passingScore: number;
  timeLimit: number | null;
  maxAttempts: number;
  randomizeQuestions: boolean;
  showResultsAfter: boolean;
  orgId: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  type: QuizType;
  questionTh: string;
  questionEn: string;
  config: McqConfig | EssayConfig | MatchingConfig | DragDropConfig;
  points: number;
  sortOrder: number;
}

export interface McqConfig {
  choices: { text_th: string; text_en: string }[];
  correctIndices: number[];
  explanation_th?: string;
  explanation_en?: string;
}

export interface EssayConfig {
  wordLimit: number | null;
  rubric_th?: string;
  rubric_en?: string;
}

export interface MatchingConfig {
  leftItems: { id: string; text_th: string; text_en: string }[];
  rightItems: { id: string; text_th: string; text_en: string }[];
  pairs: { left: string; right: string }[];
}

export interface DragDropConfig {
  items: { id: string; text_th: string; text_en: string }[];
  correctOrder: string[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number | null;
  passed: boolean | null;
  startedAt: string;
  submittedAt: string | null;
  answers?: QuizAnswer[];
}

export interface QuizAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  answer: unknown;
  score: number | null;
  gradingStatus: GradingStatus;
  feedback: string | null;
}
