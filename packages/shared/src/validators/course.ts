import { z } from 'zod';

export const createCourseSchema = z.object({
  titleTh: z.string().min(1, 'Title (TH) is required'),
  titleEn: z.string().min(1, 'Title (EN) is required'),
  descriptionTh: z.string().optional(),
  descriptionEn: z.string().optional(),
  category: z.string().optional(),
  selfEnroll: z.boolean().default(false),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema.partial();
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

export const createModuleSchema = z.object({
  titleTh: z.string().min(1),
  titleEn: z.string().min(1),
  sortOrder: z.number().int().min(0).default(0),
});

export type CreateModuleInput = z.infer<typeof createModuleSchema>;

export const createLessonSchema = z.object({
  titleTh: z.string().min(1),
  titleEn: z.string().min(1),
  contentTh: z.string().optional(),
  contentEn: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  fileUrl: z.string().url().optional().or(z.literal('')),
  sortOrder: z.number().int().min(0).default(0),
  durationMinutes: z.number().int().min(0).optional(),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
