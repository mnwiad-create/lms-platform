import { z } from 'zod';

export const createQuizSchema = z.object({
  titleTh: z.string().min(1),
  titleEn: z.string().min(1),
  passingScore: z.number().min(0).max(100).default(80),
  timeLimit: z.number().int().min(0).nullable().default(null),
  maxAttempts: z.number().int().min(1).default(3),
  randomizeQuestions: z.boolean().default(false),
  showResultsAfter: z.boolean().default(true),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;

export const submitQuizSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.unknown(),
  })),
});

export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;

export const gradeEssaySchema = z.object({
  score: z.number().min(0),
  feedback: z.string().optional(),
});

export type GradeEssayInput = z.infer<typeof gradeEssaySchema>;
