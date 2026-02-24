import { QuizType } from '../types/quiz';

export const QUIZ_TYPE_LABELS: Record<QuizType, { th: string; en: string }> = {
  [QuizType.MCQ]: { th: 'ปรนัย', en: 'Multiple Choice' },
  [QuizType.ESSAY]: { th: 'อัตนัย', en: 'Essay' },
  [QuizType.MATCHING]: { th: 'จับคู่', en: 'Matching' },
  [QuizType.DRAG_DROP]: { th: 'ลากวาง', en: 'Drag & Drop' },
};

export const AUTO_GRADABLE_TYPES: QuizType[] = [QuizType.MCQ, QuizType.MATCHING, QuizType.DRAG_DROP];

export const DEFAULT_QUIZ_SETTINGS = {
  passingScore: 80,
  timeLimit: null,
  maxAttempts: 3,
  randomizeQuestions: false,
  showResultsAfter: true,
};
