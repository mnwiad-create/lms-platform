export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface Course {
  id: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string | null;
  descriptionEn: string | null;
  category: string | null;
  status: CourseStatus;
  selfEnroll: boolean;
  thumbnailUrl: string | null;
  orgId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  modules?: Module[];
  _count?: { enrollments: number };
}

export interface Module {
  id: string;
  courseId: string;
  titleTh: string;
  titleEn: string;
  sortOrder: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  titleTh: string;
  titleEn: string;
  contentTh: string | null;
  contentEn: string | null;
  videoUrl: string | null;
  videoType: VideoType | null;
  fileUrl: string | null;
  sortOrder: number;
  durationMinutes: number | null;
}

export enum VideoType {
  YOUTUBE = 'YOUTUBE',
  VIMEO = 'VIMEO',
  HLS = 'HLS',
  MP4 = 'MP4',
}
